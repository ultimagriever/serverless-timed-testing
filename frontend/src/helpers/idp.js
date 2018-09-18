import AWS from 'aws-sdk';

export async function setCognitoCredentials({ identityPoolId, loginDomain, token }) {
  AWS.config.region = process.env.REACT_APP_AWS_REGION;

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
    Logins: {
      [loginDomain]: token
    }
  });

  try {
    await AWS.config.credentials.refreshPromise();
  } catch (err) {
    throw err;
  }
}
