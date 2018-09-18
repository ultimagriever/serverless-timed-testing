import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Row, Col, Jumbotron } from 'reactstrap';
import AdminLoginForm from './forms/AdminLoginForm';
import StudentLoginForm from './forms/StudentLoginForm';

class Login extends Component {
  render() {
    console.log(this.props.authenticated);
    if (this.props.authenticated) {
      return <Redirect to="/" />;
    }

    return (
      <Row className="d-flex align-items-center justify-content-center" id="login">
        <Col md={6} sm={12}>
          <Jumbotron>
            <Row>
              <Col md={6} sm={12} className="border-right border-secondary">
                <h3>Acesso Admin</h3>
                <AdminLoginForm />
              </Col>
              <Col md={6} sm={12}>
                <h3>Acesso Estudante</h3>
                <StudentLoginForm />
              </Col>
            </Row>
          </Jumbotron>
        </Col>
      </Row>
    )
  }
}

export default connect(state => ({ authenticated: state.auth.authenticated }))(Login);
