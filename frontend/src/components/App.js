import React, { Component } from 'react';
import { Container } from 'reactstrap';
import firebase from 'firebase/app';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from './includes/Header';
import Routes from '../routes';
import { signInCurrentStudent } from '../actions/studentAuthActions';

class App extends Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
    });

    this.props.signInCurrentStudent();
  }

  render() {
    return (
      <div>
        <Header/>
        <Container>
          <Routes/>
        </Container>
      </div>
    );
  }
}

export default withRouter(connect(null, { signInCurrentStudent })(App));
