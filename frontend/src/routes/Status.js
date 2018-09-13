import React from 'react';
import { Route } from 'react-router-dom';

const Status = ({ code, url, children }) => (
  <Route render={({ staticContext }) => {
    if (code < 400 && code >= 300) {
      staticContext.url = url;
    }

    return children;
  }} />
);

export default Status;
