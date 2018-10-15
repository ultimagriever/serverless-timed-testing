const AWS = require('aws-sdk');
const uuid = require('uuid');
const { addCorsHeader, extractUserGuid } = require('./helpers');

const dynamodb = new AWS.DynamoDB();

exports.get = async function(event) {

  const scanParams = {
    TableName: process.env.DYNAMODB_TABLE
  };

  let params;

  const userId = extractUserGuid(event);
  if (event.pathParameters) {
    params = Object.assign({}, scanParams, {
      KeyConditionExpression: "id = :id AND ownerId = :ownerId",
      ExpressionAttributeValues: {
        ":id": {
          S: event.pathParameters.id
        },
        ":ownerId": {
          S: userId
        }
      }
    });
  } else {
    params = Object.assign({}, scanParams, {
      IndexName: 'owner-index',
      KeyConditionExpression: "ownerId = :id",
      ExpressionAttributeValues: {
        ":id": {
          S: userId
        }
      }
    });
  }

  const result = await dynamodb.query(params).promise();

  if (event.pathParameters && !result.Items.length) {
    return addCorsHeader({
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  const items = result.Items.map(AWS.DynamoDB.Converter.unmarshall);

  return addCorsHeader({
    statusCode: 200,
    body: JSON.stringify(event.pathParameters ? items.pop() : items),
    headers: {
      "Content-Type": "application/json"
    }
  });
};

exports.create = async function(event) {
  const body = JSON.parse(event.body);
  const id = uuid.v4();

  const owner = extractUserGuid(event);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: {
        S: id
      },
      title: {
        S: body.title
      },
      timeLimit: {
        S: body.timeLimit
      },
      description: {
        S: body.description
      },
      ownerId: {
        S: owner
      },
      questionCount: {
        N: body.questionCount
      }
    }
  };

  try {
    await dynamodb.putItem(params).promise();

    return addCorsHeader({
      statusCode: 201,
      body: id,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (err) {
    console.error(err);
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify("Internal Server Error"),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

exports.update = async function(event) {
  const body = JSON.parse(event.body);

  const owner = extractUserGuid(event);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: {
        S: event.pathParameters.id
      },
      ownerId: {
        S: owner
      }
    },
    UpdateExpression: "SET #title = :title, #desc = :desc, #timeLimit = :timeLimit, #qc = :qc",
    ExpressionAttributeNames: {
      '#title': 'title',
      '#desc': 'description',
      '#timeLimit': 'timeLimit',
      '#qc': 'questionCount'
    },
    ExpressionAttributeValues: {
      ':title': {
        S: body.title
      },
      ':desc': {
        S: body.description
      },
      ':timeLimit': {
        S: body.timeLimit
      },
      ':qc': {
        N: body.questionCount
      }
    }
  };

  try {
    await dynamodb.updateItem(params).promise();

    return addCorsHeader({
      statusCode: 200,
      body: event.pathParameters.id,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (err) {
    console.error(err);
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    });
  }
};

exports.delete = async function(event) {
  const owner = extractUserGuid(event);
  const testId = event.pathParameters.id

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: {
        S: testId
      },
      ownerId: {
        S: owner
      }
    }
  };

  try {
    await cascadeDelete({
      TableName: process.env.DYNAMODB_DOMAIN_TABLE,
      IndexName: 'test-index',
      testId
    });
    await cascadeDelete({
      TableName: process.env.DYNAMODB_QUESTION_TABLE,
      IndexName: 'test-domain-index',
      testId
    });

    await dynamodb.deleteItem(params).promise();

    return addCorsHeader({
      statusCode: 200,
      body: JSON.stringify({ success: true })
    });
  } catch (err) {
    console.error(err);
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    });
  }
};

async function cascadeDelete({ TableName, IndexName, testId }) {
  const records = await dynamodb.query({
    TableName,
    IndexName,
    KeyConditionExpression: "testId = :testId",
    ExpressionAttributeValues: {
      ":testId": {
        S: testId
      }
    }
  }).promise();

  if (records.Items.length) {
    const batchRequest = {
      RequestItems: {
        [TableName]: records.Items.map(record => ({
          DeleteRequest: {
            Key: {
              id: {
                S: record.id.S
              },
              testId: {
                S: testId
              }
            }
          }
        }))
      }
    };

    await dynamodb.batchWriteItem(batchRequest).promise();
  }
}
