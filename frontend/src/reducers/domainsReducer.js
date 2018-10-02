import { combineReducers } from 'redux';
import {DOMAINS_FETCH_ALL, DOMAINS_FETCH_ONE, DOMAINS_LOADED, DOMAINS_LOADING} from '../actions/types';

export default combineReducers({
  all(state = [], { type, payload }) {
    return type === DOMAINS_FETCH_ALL ? payload : state;
  },
  loading(state = true, { type }) {
    switch (type) {
      case DOMAINS_LOADING:
        return true;
      case DOMAINS_LOADED:
      case DOMAINS_FETCH_ALL:
      case DOMAINS_FETCH_ONE:
        return false;
      default:
        return state;
    }
  },
  one(state = {}, { type, payload }) {
    return type === DOMAINS_FETCH_ONE ? payload : state;
  }
});
