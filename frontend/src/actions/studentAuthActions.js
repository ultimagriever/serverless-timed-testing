import { authenticateOneTimePassword } from '../helpers/studentAuth';
import { AUTH_SIGNIN, AUTH_RETRIEVED, AUTH_RETRIEVING } from './types';

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
