import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import auth from './authenticationReducer';
import domains from './domainsReducer';
import questions from './questionsReducer';
import tests from './testsReducer';


export default combineReducers({
  auth,
  domains,
  form,
  questions,
  tests
});
