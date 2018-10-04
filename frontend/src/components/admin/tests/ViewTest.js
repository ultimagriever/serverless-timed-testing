import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { Container, Nav, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import { getTestById } from '../../../actions/testActions';
import Loading from '../../common/Loading';
import RequireAccessLevel from '../../../hoc/RequireAccessLevel';
import ListDomains from './domains/ListDomains';


class ViewTest extends Component {
  state = {
    activeTab: 'domains'
  };

  componentWillMount() {
    const { id } = this.props.match.params;

    this.props.getTestById(id);
  }

  toggleTab = tab => this.setState(() => ({ activeTab: tab }));

  render() {
    if (this.props.loading || !this.props.test) {
      return <Loading />;
    }

    const { title, description } = this.props.test;
    return (
      <Container>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>
          <Link to="/admin/tests">
            <i className="fa fa-long-arrow-left" /> Go back
          </Link>
        </p>
        <Nav tabs>
          <NavItem>
            <NavLink
              href="#"
              onClick={() => this.toggleTab('domains')}
              active={this.state.activeTab === 'domains'}
            >
              Domains
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              onClick={() => this.toggleTab('questions')}
              active={this.state.activeTab === 'questions'}
            >
              Questions
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="domains">
            <Container className="mt-5">
              <ListDomains testId={this.props.match.params.id} />
            </Container>
          </TabPane>
          <TabPane tabId="questions">
            <Container className="mt-5">
              <h3>TODO</h3>
            </Container>
          </TabPane>
        </TabContent>
      </Container>
    )
  }
}

const enhance = compose(
  RequireAccessLevel('user'),
  connect(state => ({ test: state.tests.one, loading: state.tests.loading }), { getTestById })
);

export default enhance(ViewTest);
