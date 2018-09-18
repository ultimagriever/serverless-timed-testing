const admin = require('firebase-admin');
const AWS = require('aws-sdk');
const moment = require('moment');
const serviceAccount = require('./serviceAccountKey.json');
const { addCorsHeader } = require('./helpers');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://serverless-timed-testing.firebaseio.com'
});

const parsePhone = phone => String(phone).replace(/\D+/g, '');

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
      uid: phone
    });

    return addCorsHeader({
      statusCode: 201,
      body: JSON.stringify(user)
    });
  } catch (error) {
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify(error)
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

    if (moment().valueOf() > moment(row.iat).add(10, 'minute')) {
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
