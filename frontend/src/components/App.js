import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from './includes/Header';
import Routes from '../routes';

class App extends Component {
  render() {
    if (this.props.retrieving && !this.props.authenticated) {
      return (
        <Container fluid>
          <i className="fa fa-spinner fa-spin fa-5x" />
        </Container>
      );
    }

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

export default withRouter(connect(state => state.auth)(App));
