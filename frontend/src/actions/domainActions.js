import axios from 'axios';
import { signRequest } from '../helpers/aws4';
import { DOMAINS_FETCH_ALL, DOMAINS_LOADING, DOMAINS_LOADED, DOMAINS_FETCH_ONE } from './types';

export function getDomains(testId) {
  return async function (dispatch) {
    dispatch({
      type: DOMAINS_LOADING
    });

    const request = signRequest({
      method: 'GET',
      path: `/tests/${testId}/domains`
    });

    try {
      const { data } = await axios.get(request.url, { headers: request.headers });

      dispatch({
        type: DOMAINS_FETCH_ALL,
        payload: data
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export function getDomainById({ testId, domainId }) {
  return async function (dispatch) {
    dispatch({
      type: DOMAINS_LOADING
    });

    const request = signRequest({
      method: 'GET',
      path: `/tests/${testId}/domains/${domainId}`
    });

    try {
      const { data } = await axios.get(request.url, { headers: request.headers });

      dispatch({
        type: DOMAINS_FETCH_ONE,
        payload: data
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export function createDomain({ testId, ...values }) {
  return async function (dispatch) {
    dispatch({
      type: DOMAINS_LOADING
    });

    const request = signRequest({
      method: 'POST',
      path: `/tests/${testId}/domains`,
      body: values
    });

    try {
      await axios.post(request.url, values, { headers: request.headers });

      dispatch({
        type: DOMAINS_LOADED
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export function updateDomain({ testId, domainId, ...values }) {
  return async function (dispatch) {
    dispatch({
      type: DOMAINS_LOADING
    });

    const request = signRequest({
      method: 'PUT',
      path: `/tests/${testId}/domains/${domainId}`,
      body: values
    });

    try {
      await axios.put(request.url, values, { headers: request.headers });

      dispatch({
        type: DOMAINS_LOADED
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export function deleteDomain({ testId, domainId }) {
  return async function (dispatch) {
    const request = signRequest({
      method: 'DELETE',
      path: `/tests/${testId}/domains/${domainId}`
    });

    try {
      await axios.delete(request.url, { headers: request.headers });

      dispatch(getDomains(testId));
    } catch (err) {
      console.error(err);
      alert('There was an error deleting this domain, please try again or contact your system administrator.');
    }
  }
}
