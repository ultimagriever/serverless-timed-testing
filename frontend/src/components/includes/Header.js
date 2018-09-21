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
import AdminLinks from './AdminLinks';

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
              {
                this.props.authenticated && this.props.user && AdminLinks.map(({ to, label }, index) => (
                  <NavItem key={index}>
                    <NavLink tag={Link} to={to}>
                      {label}
                    </NavLink>
                  </NavItem>
                ))
              }
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

export default connect(state => state.auth)(Header);
