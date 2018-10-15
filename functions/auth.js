const admin = require('firebase-admin');
const AWS = require('aws-sdk');
const moment = require('moment');
const serviceAccount = require('./serviceAccountKey.json');
const { addCorsHeader, extractUserGuid } = require('./helpers');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://serverless-timed-testing.firebaseio.com'
});

const parsePhone = phone => String(phone).replace(/\D+/g, '');

const dynamodb = new AWS.DynamoDB();

async function fetchTest(event) {
  const testId = event.pathParameters.id;
  const ownerId = extractUserGuid(event);

  const result = await dynamodb.query({
    TableName: process.env.DYNAMODB_TEST_TABLE,
    KeyConditionExpression: "id = :testId AND ownerId = :ownerId",
    ExpressionAttributeValues: {
      ':testId': {
        S: testId
      },
      ':ownerId': {
        S: ownerId
      }
    },
    ProjectionExpression: "enrolledStudents"
  }).promise();

  return AWS.DynamoDB.Converter.unmarshall(result.Items.pop());
}

exports.getUsers = async function(event) {
  if (event.pathParameters.uid) {
    const user = await admin.auth().getUser(event.pathParameters.uid);

    if (user) {
      return addCorsHeader({
        statusCode: 200,
        body: JSON.stringify(user.toJSON())
      });
    }

    return addCorsHeader({
      statusCode: 404,
      body: 'Not Found',
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  const test = await fetchTest(event);

  if (!test.enrolledStudents) {
    return addCorsHeader({
      statusCode: 200,
      body: "[]",
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const userPromises = test.enrolledStudents.values.map(async uid => (await admin.auth().getUser(uid)).toJSON());

  return addCorsHeader({
    statusCode: 200,
    body: JSON.stringify(await Promise.all(userPromises))
  });
};

exports.createUser = async function(event) {
  const body = JSON.parse(event.body);

  if (!body.phone) {
    return addCorsHeader({
      statusCode: 422,
      body: JSON.stringify({
        error: 'Bad Input'
      })
    });
  }

  const phone = parsePhone(body.phone);

  try {
    const user = await admin.auth().createUser({
      uid: phone,
      email: body.email,
      displayName: body.displayName
    });

    if (user) {
      const test = await fetchTest(event);

      await dynamodb.updateItem({
        TableName: process.env.DYNAMODB_TEST_TABLE,
        Key: {
          id: {
            S: testId
          },
          ownerId: {
            S: ownerId
          }
        },
        UpdateExpression: "SET enrolledStudents = :enrolledStudents",
        ExpressionAttributeValues: {
          ':enrolledStudents': {
            SS: test.enrolledStudents ? [...test.enrolledStudents.values, user.uid] : [user.uid]
          }
        }
      }).promise();

      return addCorsHeader({
        statusCode: 201,
        body: JSON.stringify(user)
      });
    }

    return addCorsHeader({
      statusCode: 422,
      body: JSON.stringify({
        error: "Unprocessable Entity"
      })
    });
  } catch (error) {
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify(error)
    });
  }
};

exports.updateUser = async function(event) {
  const body = JSON.parse(event.body);

  const uid = event.pathParameters.uid;

  try {
    const userExists = await admin.auth().getUser(uid);

    if (!userExists) {
      return addCorsHeader({
        statusCode: 404,
        body: 'Not Found',
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    const user = await admin.auth().updateUser(uid, {
      email: body.email,
      displayName: body.displayName
    });

    return addCorsHeader({
      statusCode: 200,
      body: JSON.stringify(user.toJSON())
    });
  } catch (e) {
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    })
  }
};

exports.deleteUser = async function(event) {
  const uid = event.pathParameters.uid;
  const testId = event.pathParameters.id;
  const ownerId = extractUserGuid(event);

  try {
    const test = await fetchTest(event);

    const index = test.enrolledStudents.values.findIndex(id => id === uid);

    await dynamodb.updateItem({
      TableName: process.env.DYNAMODB_TEST_TABLE,
      Key: {
        id: {
          S: testId
        },
        ownerId: {
          S: ownerId
        }
      },
      UpdateExpression: "SET enrolledStudents = :enrolledStudents",
      ExpressionAttributeValues: {
        ":enrolledStudents": {
          SS: [...test.enrolledStudents.values.slice(0, index), ...test.enrolledStudents.values.slice(index + 1)]
        }
      }
    }).promise();

    return addCorsHeader({
      statusCode: 204
    });
  } catch (e) {
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error"
      })
    });
  }
};

exports.generateCode = async function(event) {
  const body = JSON.parse(event.body);

  if (!body.phone) {
    return addCorsHeader({
      statusCode: 422,
      body: JSON.stringify({
        error: 'Phone number is required'
      })
    });
  }

  const phone = parsePhone(body.phone);

  try {
    const user = await admin.auth().getUser(phone);

    const code = Math.floor(Math.random() * 899999) + 100000;

    const sns = new AWS.SNS();

    await sns.setSMSAttributes({
      attributes: {
        DefaultSMSType: 'Transactional'
      }
    }).promise();

    await sns.publish({
      Message: `Your Serverless Timed Testing code is ${code}`,
      PhoneNumber: `+${phone}`
    }).promise();

    await admin.database().ref(`/users/${phone}`)
      .update({ code, iat: (new Date().getTime()) });

    return addCorsHeader({
      statusCode: 200,
      body: JSON.stringify({ success: true })
    });
  } catch (error) {
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify(error)
    });
  }
};

exports.authenticate = async function(event) {
  const body = JSON.parse(event.body);

  if (!(body.code && body.phone)) {
    return addCorsHeader({
      statusCode: 422,
      body: JSON.stringify({
        message: 'Both phone number and verification code must be provided'
      })
    });
  }

  const phone = parsePhone(body.phone);
  const code = parseInt(body.code);

  try {
    const user = await admin.auth().getUser(phone);

    const snapshot = await admin.database().ref('users').child(user.uid).once('value');

    const row = snapshot.val();

    if (row.code !== code) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'Unauthorized'
        })
      };
    }

    if (moment().valueOf() > moment(row.iat).add(5, 'minute')) {
      return addCorsHeader({
        statusCode: 401,
        body: JSON.stringify({
          message: 'Expired Code'
        })
      });
    }

    const token = await admin.auth().createCustomToken(phone);

    return addCorsHeader({
      statusCode: 200,
      body: JSON.stringify({ token })
    });

  } catch (error) {
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify(error)
    });
  }
};
