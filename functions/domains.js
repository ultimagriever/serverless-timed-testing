const AWS = require('aws-sdk');
const uuid = require('uuid');
const { addCorsHeader, parseDdbItem } = require('./helpers');

const dynamodb = new AWS.DynamoDB();

exports.get = async function(event) {
  const scanParams = {
    TableName: process.env.DYNAMODB_TABLE
  };

  let params;

  if (event.pathParameters.domainId) {
    params = Object.assign({}, scanParams, {
      KeyConditionExpression: "id = :id AND testId = :testId",
      ExpressionAttributeValues: {
        ":id": {
          S: event.pathParameters.domainId
        },
        ":testId": {
          S: event.pathParameters.id
        }
      }
    });
  } else {
    params = Object.assign({}, scanParams, {
      IndexName: 'test-index',
      KeyConditionExpression: "testId = :id",
      ExpressionAttributeValues: {
        ":id": {
          S: event.pathParameters.id
        }
      }
    });
  }

  const result = await dynamodb.query(params).promise();

  if (event.pathParameters.domainId && !result.Items.length) {
    return addCorsHeader({
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  const items = result.Items.map(parseDdbItem);

  return addCorsHeader({
    statusCode: 200,
    body: JSON.stringify(event.pathParameters.domainId ? items.pop() : items),
    headers: {
      "Content-Type": "application/json"
    }
  });
};

exports.create = async function(event) {
  const body = JSON.parse(event.body);
  const id = uuid.v4();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: {
        S: id
      },
      testId: {
        S: event.pathParameters.id
      },
      title: {
        S: body.title
      },
      description: {
        S: body.description
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
      body: JSON.stringify({ message: "Internal Server Error" })
    });
  }

};

exports.update = async function(event) {
  const body = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: {
        S: event.pathParameters.domainId
      },
      testId: {
        S: event.pathParameters.id
      }
    },
    UpdateExpression: "SET #title = :title, #desc = :desc",
    ExpressionAttributeNames: {
      "#title": "title",
      "#description": "description"
    },
    ExpressionAttributeValues: {
      ":title": {
        S: body.title
      },
      ":description": {
        S: body.description
      }
    }
  };

  try {
    await dynamodb.updateItem(params).promise();

    return addCorsHeader({
      statusCode: 200,
      body: event.pathParameters.domainId,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (err) {
    console.error(err);
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    });
  }
};
