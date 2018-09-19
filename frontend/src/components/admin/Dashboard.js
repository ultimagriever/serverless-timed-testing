import React, { Component } from 'react';
import RequireAccessLevel from '../../hoc/RequireAccessLevel';

class Dashboard extends Component {
  render() {
    return <h1>Admin-level Access</h1>;
  }
}

export default RequireAccessLevel('user')(Dashboard);
