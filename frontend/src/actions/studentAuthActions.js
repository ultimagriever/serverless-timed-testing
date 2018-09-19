import {authenticateOneTimePassword, getCurrentlySignedIn, signoutStudentAuth} from '../helpers/studentAuth';
import {AUTH_SIGNIN, AUTH_RETRIEVED, AUTH_RETRIEVING, AUTH_SIGNOUT} from './types';

export function authenticateStudent(values) {
  return async function (dispatch) {
    dispatch({
      type: AUTH_RETRIEVING
    });

    try {
      const token = await authenticateOneTimePassword(values);

      dispatch({
        type: AUTH_SIGNIN,
        payload: { token }
      });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({
        type: AUTH_RETRIEVED
      });
    }
  }
}

export function signInCurrentStudent() {
  return async function (dispatch) {
    dispatch({
      type: AUTH_RETRIEVING
    });

    try {
      const token = await getCurrentlySignedIn();

      if (token) {
        dispatch({
          type: AUTH_SIGNIN,
          payload: { token }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({
        type: AUTH_RETRIEVED
      });
    }
  }
}

export function signoutStudent() {
  return async function (dispatch) {
    try {
      await signoutStudentAuth();

      dispatch({
        type: AUTH_SIGNOUT
      });
    } catch (err) {
      console.error(err);
    }
  }
}
