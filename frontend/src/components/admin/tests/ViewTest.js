import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { getTestById } from '../../../actions/testActions';
import Loading from '../../common/Loading';
import RequireAccessLevel from '../../../hoc/RequireAccessLevel';
import ListDomains from './domains/ListDomains';


class ViewTest extends Component {
  componentWillMount() {
    const { id } = this.props.match.params;

    this.props.getTestById(id);
  }

  render() {
    if (this.props.loading || !this.props.test) {
      return <Loading />;
    }

    const { title, description } = this.props.test;
    return (
      <Container>
        <h1>{title}</h1>
        <p>{description}</p>
        <Row>
          <Col md={12}>
            <h2>Domains</h2>
            <ListDomains testId={this.props.match.params.id} />
          </Col>
        </Row>
      </Container>
    )
  }
}

const enhance = compose(
  RequireAccessLevel('user'),
  connect(state => ({ test: state.tests.one, loading: state.tests.loading }), { getTestById })
);

export default enhance(ViewTest);
