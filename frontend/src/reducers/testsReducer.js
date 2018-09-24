import { combineReducers } from 'redux';
import {TESTS_FETCH_ALL, TESTS_FETCH_ONE, TESTS_LOADED, TESTS_LOADING} from '../actions/types';

export default combineReducers({
  all(state = [], { type, payload }) {
    return type === TESTS_FETCH_ALL ? payload : state;
  },
  loading(state = false, { type }) {
    switch (type) {
      case TESTS_LOADING:
        return true;
      case TESTS_FETCH_ALL:
      case TESTS_LOADED:
      case TESTS_FETCH_ONE:
        return false;
      default:
        return state;
    }
  },
  one(state = null, { type, payload }) {
    return type === TESTS_FETCH_ONE ? payload : state
  }
});
