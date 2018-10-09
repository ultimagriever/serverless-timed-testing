import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { FormGroup, Button, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import TextInput from './inputs/TextInput';

class TestForm extends Component {
  render() {
    const { pristine, submitting, reset, handleSubmit, loading } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        <Field
          name="title"
          component={TextInput}
          label="Title"
          placeholder="e.g. Java Skills Test"
        />
        <Field
          name="description"
          component={TextInput}
          label="Description"
          placeholder="e.g. This is a <time limit> test to assess the candidate's skills [...]"
          type="textarea"
        />
        <Field
          name="timeLimit"
          component={TextInput}
          label="Time limit"
          placeholder="15 minutes = 15:00"
        />
        <Field
          name="questionCount"
          component={TextInput}
          label="# of Questions"
          placeholder="e.g. 20"
        />
        <FormGroup className="d-flex justify-content-center">
          <Button color="default" tag={Link} to="/admin/tests">
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
  form: 'testForm',
  enableReinitialize: true
})(TestForm);
