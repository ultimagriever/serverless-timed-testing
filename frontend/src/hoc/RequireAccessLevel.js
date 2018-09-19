import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

export default level => ComposedComponent => {
  class RequireAccessLevel extends Component {
    render() {
      if (!this.props[level]) {
        return (
          <Alert color="danger">
            <h1>Access Denied</h1>
          </Alert>
        );
      }

      return <ComposedComponent {...this.props} />;
    }
  }

  return connect(state => ({ [level]: state.auth[level] }))(RequireAccessLevel);
}
