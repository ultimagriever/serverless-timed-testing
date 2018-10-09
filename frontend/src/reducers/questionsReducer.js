import { combineReducers } from 'redux';
import { QUESTIONS_FETCH_ALL, QUESTIONS_FETCH_ONE, QUESTIONS_LOADED, QUESTIONS_LOADING } from '../actions/types';

export default combineReducers({
  all(state = [], { type, payload }) {
    return type === QUESTIONS_FETCH_ALL ? payload : state;
  },
  one(state = {}, { type, payload }) {
    return type === QUESTIONS_FETCH_ONE ? payload : state;
  },
  loading(state = false, { type }) {
    switch (type) {
      case QUESTIONS_LOADING:
        return true;
      case QUESTIONS_FETCH_ONE:
      case QUESTIONS_FETCH_ALL:
      case QUESTIONS_LOADED:
        return false;
      default:
        return state;
    }
  }
});
