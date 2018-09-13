import React from 'react';
import Status from './Status';

const NoMatch = () => (
  <Status code={404}>
    <h1>404 Not Found</h1>
  </Status>
);

export default NoMatch;
