import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createDomain } from '../../../../actions/domainActions';
import RequireAccessLevel from '../../../../hoc/RequireAccessLevel';
import DomainForm from '../../../forms/DomainForm';

class NewDomain extends Component {
  handleSubmit = async values => {
    const { id: testId } = this.props.match.params;

    await this.props.createDomain({ testId, ...values });
    this.props.history.push(`/admin/tests/${testId}`);
  }

  render() {
    const { id } = this.props.match.params;

    return (
      <DomainForm
        loading={this.props.loading}
        testId={id}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const enhance = compose(
  RequireAccessLevel('user'),
  connect(state => ({ loading: state.domains.loading }), { createDomain })
);

export default enhance(NewDomain);
