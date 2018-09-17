const AWS = require('aws-sdk');

exports.get = async function(event) {
  return {
    statusCode: 200,
    body: JSON.stringify([]),
    headers: {
      "Content-Type": "application/json"
    }
  }
};
