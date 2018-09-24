import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getTestById, updateTest } from '../../../actions/testActions';
import TestForm from '../../forms/TestForm';
import RequireAccessLevel from '../../../hoc/RequireAccessLevel';

class EditTest extends Component {
  componentWillMount() {
    const { id } = this.props.match.params;

    this.props.getTestById(id);
  }

  handleSubmit = async values => {
    await this.props.updateTest(values);

    this.props.history.push('/admin/tests');
  };

  render() {
    return <TestForm
      loading={this.props.loading}
      initialValues={this.props.test}
      onSubmit={this.handleSubmit}
    />;
  }
}

const enhance = compose(
  RequireAccessLevel('user'),
  connect(state => ({ loading: state.tests.loading, test: state.tests.one }), { getTestById, updateTest })
);

export default enhance(EditTest);
