const AWS = require('aws-sdk');
const uuid = require('uuid');
const { addCorsHeader, extractUserGuid } = require('./helpers');

exports.get = async function(event) {
  const dynamodb = new AWS.DynamoDB();

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

  return addCorsHeader({
    statusCode: 200,
    body: JSON.stringify(result.Items),
    headers: {
      "Content-Type": "application/json"
    }
  });
};

exports.create = async function(event) {
  const dynamodb = new AWS.DynamoDB();
  const body = JSON.parse(body);
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
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify("Internal Server Error"),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
