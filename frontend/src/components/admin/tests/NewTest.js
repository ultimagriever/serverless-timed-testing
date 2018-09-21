import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createTest } from '../../../actions/testActions';
import RequireAccessLevel from '../../../hoc/RequireAccessLevel';
import TestForm from '../../forms/TestForm';

class NewTest extends Component {
  handleSubmit = async values => {
    await this.props.createTest(values);

    this.props.history.push('/admin/tests');
  };

  render() {
    return <TestForm loading={this.props.loading} onSubmit={this.handleSubmit} />;
  }
}

const enhance = compose(
  RequireAccessLevel('user'),
  connect(state => ({ loading: state.tests.loading }), { createTest })
);

export default enhance(NewTest);
