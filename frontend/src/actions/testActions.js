import axios from 'axios';
import {TESTS_FETCH_ALL, TESTS_LOADED, TESTS_LOADING, TESTS_FETCH_ONE} from './types';
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
      method: 'POST',
      path: '/tests',
      body: values
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

export function getTestById(id) {
  return async function (dispatch) {
    dispatch({
      type: TESTS_LOADING
    });

    const request = signRequest({
      method: 'GET',
      path: `/tests/${id}`
    });

    try {
      const { data } = await axios.get(request.url, {
        headers: request.headers
      });

      dispatch({
        type: TESTS_FETCH_ONE,
        payload: data
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: TESTS_FETCH_ONE,
        payload: null
      })
    }
  }
}

export function updateTest({ id, ...values }) {
  return async function (dispatch) {
    dispatch({
      type: TESTS_LOADING
    });

    const request = signRequest({
      method: 'PUT',
      path: `/tests/${id}`,
      body: values
    });

    try {
      await axios.put(request.url, values, { headers: request.headers });

      dispatch({
        type: TESTS_LOADED
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export function deleteTest(id) {
  return async function (dispatch) {
    const request = signRequest({
      method: 'DELETE',
      path: `/tests/${id}`
    });

    try {
      await axios.delete(request.url, { headers: request.headers });

      dispatch(getTests());
    } catch (err) {
      console.error(err);
    }
  }
}
