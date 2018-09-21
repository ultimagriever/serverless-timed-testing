import axios from 'axios';
import {TESTS_FETCH_ALL, TESTS_LOADED, TESTS_LOADING} from './types';
import { signRequest } from '../helpers/aws4';

export function getTests() {
  return async function (dispatch) {
    dispatch({
      type: TESTS_LOADING
    });

    const request = signRequest({
      method: 'GET',
      path: '/tests'
    });

    try {
      const { data } = await axios.get(request.url, {
        headers: request.headers
      });

      dispatch({
        type: TESTS_FETCH_ALL,
        payload: data
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: TESTS_FETCH_ALL,
        payload: null
      });
    }
  }
}

export function createTest(values) {
  return async function (dispatch) {
    dispatch({
      type: TESTS_LOADING
    });

    const request = signRequest({
      method: 'GET',
      path: '/tests'
    });

    try {
      await axios.post(request.url, values, { headers: request.headers });

      dispatch({
        type: TESTS_LOADED
      });
    } catch (err) {
      console.error(err);
    }
  }
}
