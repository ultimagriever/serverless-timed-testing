import AWS from 'aws-sdk';
import sigv4client from './sigv4client';

export function signRequest({ method, path, headers, body, params }) {
  const client = sigv4client.newClient({
    accessKey: AWS.config.credentials.accessKeyId,
    secretKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
    region: process.env.REACT_APP_AWS_REGION,
    endpoint: process.env.REACT_APP_API_GATEWAY_ENDPOINT
  });

  return client.signRequest({
    method,
    path,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body,
    queryParams: params
  });
}
