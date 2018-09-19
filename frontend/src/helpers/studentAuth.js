import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
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

      return await signInCognito();
    }
  } catch (err) {
    throw err;
  }
}

async function signInCognito() {
  try {
    const token = await firebase.auth().currentUser.getIdToken(true);

    await setCognitoCredentials({
      identityPoolId: process.env.REACT_APP_STUDENT_IDENTITY_POOL_ID,
      loginDomain: `securetoken.google.com/${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
      token
    });

    return token;
  } catch (err) {
    throw err;
  }
}

export async function getCurrentlySignedIn() {
  try {
    if (firebase.auth().currentUser) {
      return await signInCognito();
    }
  } catch (err) {
    throw err;
  }
}

export async function signoutStudentAuth() {
  try {
    const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
      await firebase.auth().signOut();
    }
  } catch (err) {
    throw err;
  }
}
