import { combineReducers } from 'redux';
import { AUTH_SIGNIN, AUTH_SIGNOUT, AUTH_RETRIEVED, AUTH_RETRIEVING } from '../actions/types';

export default combineReducers({
  authenticated(state = false, { type }) {
    switch (type) {
      case AUTH_SIGNIN:
        return true;
      case AUTH_SIGNOUT:
        return false;
      default:
        return state;
    }
  },
  session(state = null, { type, payload }) {
    switch (type) {
      case AUTH_SIGNIN:
        return payload.session;
      case AUTH_SIGNOUT:
        return null;
      default:
        return state;
    }
  },
  user(state = null, { type, payload }) {
    switch (type) {
      case AUTH_SIGNIN:
        return payload.user;
      case AUTH_SIGNOUT:
        return null;
      default:
        return state;
    }
  },
  retrieving(state = true, { type }) {
    switch (type) {
      case AUTH_RETRIEVING:
        return true;
      case AUTH_RETRIEVED:
        return false;
      default:
        return state;
    }
  }
});
