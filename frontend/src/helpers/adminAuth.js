import {setCognitoCredentials} from './idp';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

const config = {
  pool: new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_ADMIN_USER_POOL_ID,
    ClientId: process.env.REACT_APP_ADMIN_CLIENT_ID
  }),
  idp: process.env.REACT_APP_ADMIN_IDENTITY_POOL_ID
};

export function login({ email, password }) {
  const user = new CognitoUser({ Username: email, Pool: config.pool });
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) =>
    user.authenticateUser(authDetails, {
      onSuccess: async session => {
        await setCognitoIdpSession({ session });

        resolve({ user, session });
      },
      onFailure: err => reject(err)
    })
  );
}

export async function setCognitoIdpSession({ session }) {
  await setCognitoCredentials({
    identityPoolId: config.idp,
    loginDomain: `cognito-idp.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${process.env.REACT_APP_ADMIN_USER_POOL_ID}`,
    token: session.getIdToken().getJwtToken()
  });
}

export function logout() {
  const user = config.pool.getCurrentUser();

  if (user) {
    user.signOut();
  }
}


export function getUserFromLocalStorage() {
  return new Promise((resolve, reject) => {
    const user = config.pool.getCurrentUser();

    if (user !== null) {
      user.getSession(async (err, session) => {
        if (err) {
          return reject(err);
        }

        try {
          await setCognitoIdpSession({ session });

          resolve({ user, session });
        } catch (err) {
          reject(err);
        }
      });
    } else {
      resolve(null);
    }
  });
}
