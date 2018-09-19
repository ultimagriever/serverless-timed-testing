import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default function (ComposedComponent) {
  class RequireAuth extends Component {
    render() {
      if (!this.props.authenticated) {
        return <Redirect to="/login" />;
      }

      return <ComposedComponent {...this.props} />;
    }
  }

  return connect(state => ({ authenticated: state.auth.authenticated }))(RequireAuth);
}
