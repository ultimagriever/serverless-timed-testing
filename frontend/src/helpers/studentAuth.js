import axios from 'axios';
import { setCognitoCredentials } from './idp';

const request = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY_ENDPOINT
});

export async function requestOneTimePassword(phone) {
  const response = await request.post('/students/request-otp', { phone });

  return response.success;
}

export async function authenticateOneTimePassword({ code, phone }) {
  try {
    const response = await request.post('/students/authenticate', { code, phone });

    if (response.token) {
      await setCognitoCredentials({
        identityPoolId: process.env.REACT_APP_STUDENT_IDENTITY_POOL_ID,
        loginDomain: `securetoken.google.com/${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
        token: response.token
      });
    }
  } catch (err) {
    throw err;
  }
}
