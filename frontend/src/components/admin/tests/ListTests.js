import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Table, Container, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getTests, deleteTest } from '../../../actions/testActions';
import RequireAccessLevel from '../../../hoc/RequireAccessLevel';
import Loading from '../../common/Loading';

class ListTests extends Component {
  componentWillMount() {
    this.props.getTests();
  }

  deleteTest = async id => {
    if (window.confirm('Are you certain you wish to delete this test? This action cannot be reversed.')) {
      await this.props.deleteTest(id);
    }
  };

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <Container id="tests">
        <h1>Your Tests</h1>
        <Table striped responsive>
          <thead>
            <tr>
              <th>
                Title
              </th>
              <th>
                Description
              </th>
              <th>
                Time Limit
              </th>
              <th>
                # of Questions
              </th>
              <th colSpan={3} className="text-center">
                <Button color="primary" tag={Link} to="/admin/tests/new">
                  Create Test <i className="fa fa-plus-circle" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.tests.length ? this.props.tests.map(test => (
              <tr key={test.id}>
                <td>{test.title}</td>
                <td>{test.description}</td>
                <td>{test.timeLimit}</td>
                <td>{test.questionCount}</td>
                <td>
                  <Button color="link" tag={Link} to={`/admin/tests/${test.id}`}>
                    <i className="fa fa-search" />
                  </Button>
                </td>
                <td>
                  <Button color="link" tag={Link} to={`/admin/tests/${test.id}/edit`}>
                    <i className="fa fa-pencil" />
                  </Button>
                </td>
                <td>
                  <Button color="danger" onClick={() => this.deleteTest(test.id)}>
                    <i className="fa fa-times" />
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No tests found. Would you like to <Link to="/admin/tests/new">create a new one</Link>?
                </td>
              </tr>
            )
          }
          </tbody>
        </Table>
      </Container>
    )
  }
}

const enhance = compose(
  RequireAccessLevel('user'),
  connect(state => ({ tests: state.tests.all, loading: state.tests.loading }), { getTests, deleteTest })
);

export default enhance(ListTests);
