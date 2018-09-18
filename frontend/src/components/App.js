import React, { Component } from 'react';
import { Container } from 'reactstrap';
import firebase from 'firebase';
import Header from './includes/Header';
import Routes from '../routes';

export default class App extends Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
    });
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
