import { AUTH_SIGNIN, AUTH_SIGNOUT, AUTH_RETRIEVING, AUTH_RETRIEVED } from './types';
import { login, logout, getUserFromLocalStorage } from '../helpers/adminAuth';

export function signinAdmin({ email, password }) {
  return async function (dispatch) {
    try {
      const { user, session } = await login({ email, password });

      dispatch({
        type: AUTH_SIGNIN,
        payload: {
          user,
          session
        }
      });
    } catch (err) {
      console.error(err);
      console.error(err.stack);
    }
  }
}

export function getSignedInAdmin() {
  return async function (dispatch) {
    dispatch({ type: AUTH_RETRIEVING });

    const info = await getUserFromLocalStorage();

    if (info) {
      dispatch({
        type: AUTH_SIGNIN,
        payload: info
      });
    }

    dispatch({
      type: AUTH_RETRIEVED
    });
  }
}

export function signoutAdmin() {
  logout();

  return {
    type: AUTH_SIGNOUT
  };
}
