import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Header from './includes/Header';
import Routes from '../routes';

export default class App extends Component {
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
