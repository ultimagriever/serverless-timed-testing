import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

class ListDomains extends Component {
  deleteDomain = id => {}

  render() {
    return (
      <Table striped responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th colSpan={2} className="text-center">
              <Button size="sm" color="primary" tag={Link} to={`/admin/tests/${this.props.testId}/domains/new`}>
                Create Domain <i className="fa fa-plus" />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.domains.length ? this.props.domains.map(domain => (
            <tr key={domain.id}>
              <td>{domain.name}</td>
              <td>{domain.description}</td>
              <td>
                <Button color="link" tag={Link} to={`/admin/tests/${this.props.testId}/domains/${domain.id}/edit`}>
                  <i className="fa fa-pencil" />
                </Button>
              </td>
              <td>
                <Button color="danger" onClick={() => this.deleteDomain(domain.id)}>
                  <i className="fa fa-times" />
                </Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="text-center">
                No domains found. Would you like to <Link to={`/admin/tests/${this.props.testId}/domains/new`}>create a new one</Link>?
              </td>
            </tr>
          )
        }
        </tbody>
      </Table>
    );
  }
}

export default connect(state => ({ domains: state.domains.all, loading: state.domains.loading }))(ListDomains);
