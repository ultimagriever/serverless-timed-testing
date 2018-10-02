import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { FormGroup, Button, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import TextInput from './inputs/TextInput';

class TestForm extends Component {
  render() {
    const { pristine, submitting, reset, handleSubmit, loading, testId } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        <Field
          name="title"
          component={TextInput}
          label="Title"
          placeholder="e.g. Security"
        />
        <Field
          name="description"
          component={TextInput}
          label="Description"
          placeholder="e.g. The Security knowledge domain assesses the candidate's capabilities in properly securing a system [...]"
          type="textarea"
        />
        <FormGroup className="d-flex justify-content-center">
          <Button color="default" tag={Link} to={`/admin/tests/${testId}`}>
            <i className="fa fa-chevron-left" /> Go back
          </Button>
          <Button color="secondary" onClick={reset}>
            Reset
          </Button>
          <Button color="primary" disabled={pristine || submitting || loading}>
            Submit {loading && <i className="fa fa-spinner fa-spin" />}
          </Button>
        </FormGroup>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'domainForm',
  enableReinitialize: true
})(TestForm);
