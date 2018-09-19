import React, { Component } from 'react';
import {
  Navbar,
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Collapse,
  Container
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends Component {
  state = {
    isOpen: false
  };

  toggle() {
    this.setState(state => ({
      isOpen: !state.isOpen
    }));
  }

  render() {
    return (
      <Navbar color="dark" dark expand="lg" fixed="top">
        <Container>
          <NavbarBrand tag={Link} to="/">
            Serverless Timed Tests
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/">
                  Home
                </NavLink>
              </NavItem>
            </Nav>

            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to={this.props.authenticated ? '/logout': '/login'}>
                  {this.props.authenticated ? 'Logout' : 'Login'}
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    )
  }
}

export default connect(state => ({ authenticated: state.auth.authenticated }))(Header);
