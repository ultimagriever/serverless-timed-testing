import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Form, Button, FormGroup } from 'reactstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signinAdmin } from '../../actions/adminAuthActions';
import TextInput from './inputs/TextInput';

class AdminLoginForm extends Component {
  state = {
    loading: false
  };

  handleSubmit = async values => {
    this.setState(() => ({ loading: true }));

    await this.props.signinAdmin(values);

    this.props.history.push('/admin/dashboard');
  };

  render() {
    const { pristine, submitting, handleSubmit } = this.props;
    const { loading } = this.state;

    return (
      <Form onSubmit={handleSubmit(this.handleSubmit)} id="admin-login-form">
        <Field
          component={TextInput}
          type="email"
          name="email"
          label="E-mail"
        />
        <Field
          component={TextInput}
          type="password"
          name="password"
          label="Password"
        />
        <FormGroup className="text-center">
          <Button color="primary" disabled={pristine || submitting || loading}>
            Log in {loading && <i className="fa fa-spinner fa-spin" />}
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

const enhance = compose(
  connect(null, { signinAdmin }),
  reduxForm({
    form: 'adminLogin'
  }),
  withRouter
);

export default enhance(AdminLoginForm);
