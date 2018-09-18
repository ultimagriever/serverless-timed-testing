import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Form, Button, FormGroup } from 'reactstrap';
import TextInput from './inputs/TextInput';

class AdminLoginForm extends Component {
  handleSubmit = values => console.log(values);

  render() {
    const { pristine, submitting, handleSubmit } = this.props;

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
          <Button color="primary" disabled={pristine || submitting}>
            Log in
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

export default reduxForm({
  form: 'adminLogin'
})(AdminLoginForm);
