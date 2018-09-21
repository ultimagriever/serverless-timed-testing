import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import auth from './authenticationReducer';
import tests from './testsReducer';

export default combineReducers({
  auth,
  form,
  tests
});
