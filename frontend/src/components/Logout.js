import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Jumbotron } from 'reactstrap';
import { signoutStudent } from '../actions/studentAuthActions';

class Logout extends Component {
  componentWillMount() {
    // TODO check for admin logout
    this.props.signoutStudent();
  }

  render() {
    if (!this.props.authenticated) {
      return <Redirect to="/" />;
    }

    return (
      <Jumbotron className="mt-4" fluid>
        <h1>Signing out... <i className="fa fa-spinner fa-spin" /> </h1>
      </Jumbotron>
    )
  }
}

export default connect(null, { signoutStudent })(Logout);
