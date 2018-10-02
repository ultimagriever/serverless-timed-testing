import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getDomainById, updateDomain } from '../../../../actions/domainActions';
import RequireAccessLevel from '../../../../hoc/RequireAccessLevel';
import DomainForm from '../../../forms/DomainForm';

class EditDomain extends Component {
  componentWillMount() {
    const { id: testId, domainId } = this.props.match.params;

    this.props.getDomainById({ testId, domainId })
  }
  handleSubmit = async ({ testId, ...values }) => {
    const { domainId, id } = this.props.match.params;

    await this.props.updateDomain({ domainId, testId: id, ...values });

    this.props.history.push(`/admin/tests/${testId}`);
  };

  render() {
    return (
      <DomainForm
        initialValues={this.props.domain}
        loading={this.props.loading}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const enhance = compose(
  RequireAccessLevel('user'),
  connect(state => ({ domain: state.domains.one, loading: state.domains.loading }), { getDomainById, updateDomain })
);

export default enhance(EditDomain);
