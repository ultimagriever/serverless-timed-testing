import { combineReducers } from 'redux';
import { DOMAINS_FETCH_ALL, DOMAINS_LOADING } from '../actions/types';

export default combineReducers({
  all(state = [], { type, payload }) {
    return type === DOMAINS_FETCH_ALL ? payload : state;
  },
  loading(state = true, { type }) {
    return type !== DOMAINS_LOADING;
  }
});
