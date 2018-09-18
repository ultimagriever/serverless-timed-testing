import axios from 'axios';
import firebase from 'firebase';
import { setCognitoCredentials } from './idp';

const request = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY_ENDPOINT
});

export async function requestOneTimePassword(phone) {
  const response = await request.post('/students/request-otp', { phone });

  return response.data.success;
}

export async function authenticateOneTimePassword({ code, phone }) {
  try {
    const { data } = await request.post('/students/authenticate', { code, phone });

    if (data.token) {
      const { token } = data;

      await firebase.auth().signInWithCustomToken(token);

      const idToken = await firebase.auth().currentUser.getIdToken(true);
      console.log(idToken);

      await setCognitoCredentials({
        identityPoolId: process.env.REACT_APP_STUDENT_IDENTITY_POOL_ID,
        loginDomain: `securetoken.google.com/${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
        token: idToken
      });

      return token;
    }
  } catch (err) {
    throw err;
  }
}
