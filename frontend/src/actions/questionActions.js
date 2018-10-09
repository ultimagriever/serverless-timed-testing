import axios from 'axios';
import { signRequest } from '../helpers/aws4';
import { QUESTIONS_FETCH_ALL, QUESTIONS_LOADING, QUESTIONS_LOADED, QUESTIONS_FETCH_ONE } from './types';

export function getQuestions(testId) {
  return async function (dispatch) {
    dispatch({
      type: QUESTIONS_LOADING
    });

    const request = signRequest({
      method: 'GET',
      path: `/tests/${testId}/questions`
    });

    try {
      const { data } = await axios.get(request.url, { headers: request.headers });

      dispatch({
        type: QUESTIONS_FETCH_ALL,
        payload: data
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export function getQuestionById({ testId, questionId }) {
  return async function (dispatch) {
    dispatch({
      type: QUESTIONS_LOADING
    });

    const request = signRequest({
      method: 'GET',
      path: `/tests/${testId}/questions/${questionId}`
    });

    try {
      const { data } = await axios.get(request.url, { headers: request.headers });

      dispatch({
        type: QUESTIONS_FETCH_ONE,
        payload: data
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export function createQuestion({ testId, ...values }) {
  return async function (dispatch) {
    dispatch({
      type: QUESTIONS_LOADING
    });

    const request = signRequest({
      method: 'POST',
      path: `/tests/${testId}/questions`,
      body: values
    });

    try {
      await axios.post(request.url, values, { headers: request.headers });

      dispatch({
        type: QUESTIONS_LOADED
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export function updateQuestion({ testId, questionId, ...values }) {
  return async function (dispatch) {
    dispatch({
      type: QUESTIONS_LOADING
    });

    const request = signRequest({
      method: 'PUT',
      path: `/tests/${testId}/questions/${questionId}`,
      body: values
    });

    try {
      await axios.put(request.url, values, { headers: request.headers });

      dispatch({
        type: QUESTIONS_LOADED
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export function deleteQuestion({ testId, questionId }) {
  return async function (dispatch) {
    const request = signRequest({
      method: 'DELETE',
      path: `/tests/${testId}/questions/${questionId}`
    });

    try {
      await axios.delete(request.url, { headers: request.headers });

      dispatch(getQuestions(testId));
    } catch (err) {
      console.error(err);
      alert('There was an error deleting this question, please try again or contact your system administrator.');
    }
  }
}
