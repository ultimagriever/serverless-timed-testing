import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import auth from './authenticationReducer';

export default combineReducers({
  auth,
  form
});
