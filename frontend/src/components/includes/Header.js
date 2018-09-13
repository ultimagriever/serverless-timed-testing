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
      <Navbar color="dark" dark expand="lg" fixedTop>
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

            <Nav class="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/login">
                  Login
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    )
  }
}

export default Header;
