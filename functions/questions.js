const AWS = require('aws-sdk');
const uuid = require('uuid');
const { addCorsHeader } = require('./helpers');

const dynamodb = new AWS.DynamoDB();

exports.get = async function(event) {
  const scanParams = {
    TableName: process.env.DYNAMODB_TABLE
  };

  let params;

  if (event.pathParameters.questionId) {
    params = Object.assign({}, scanParams, {
      KeyConditionExpression: "id = :id AND testId = :testId",
      ExpressionAttributeValues: {
        ":id": {
          S: event.pathParameters.questionId
        },
        ":testId": {
          S: event.pathParameters.id
        }
      }
    });
  } else {
    params = Object.assign({}, scanParams, {
      IndexName: 'test-domain-index',
      KeyConditionExpression: "testId = :id",
      ExpressionAttributeValues: {
        ":id": {
          S: event.pathParameters.id
        }
      }
    });
  }

  const result = await dynamodb.query(params).promise();

  if (event.pathParameters.questionId && !result.Items.length) {
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
    body: JSON.stringify(event.pathParameters.questionId ? items.pop() : items),
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
      domainId: {
        S: body.domainId
      },
      stem: {
        S: body.stem
      },
      answers: {
        M: AWS.DynamoDB.Converter.marshall(body.answers)
      },
      correctAnswers: {
        SS: body.correctAnswers
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
        S: event.pathParameters.questionId
      },
      testId: {
        S: event.pathParameters.id
      }
    },
    UpdateExpression: "SET #domain = :domain, #stem = :stem, #answers = :answers, #ca = :ca",
    ExpressionAttributeNames: {
      "#domain": "domainId",
      "#stem": "stem",
      "#answers": "answers",
      "#ca": "correctAnswers"
    },
    ExpressionAttributeValues: {
      ":domain": {
        S: body.domainId
      },
      ":stem": {
        S: body.stem
      },
      ":answers": {
        M: AWS.DynamoDB.Converter.marshall(body.answers)
      },
      ":ca": {
        SS: body.correctAnswers
      }
    }
  };

  try {
    await dynamodb.updateItem(params).promise();

    return addCorsHeader({
      statusCode: 200,
      body: event.pathParameters.questionId,
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

exports.delete = async function(event) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: {
        S: event.pathParameters.questionId
      },
      testId: {
        S: event.pathParameters.id
      }
    }
  };

  try {
    await dynamodb.deleteItem(params).promise();

    return addCorsHeader({
      statusCode: 204
    });
  } catch (err) {
    return addCorsHeader({
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    });
  }
};
