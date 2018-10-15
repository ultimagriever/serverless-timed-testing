import AWS from 'aws-sdk';

export default () => next => async action => {
  if (AWS.config.credentials && AWS.config.credentials.expired) {
    await AWS.config.credentials.refreshPromise();

    return next(action);
  } else {
    return next(action);
  }
}
