import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import alphabet from 'alphabet';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form';
import { FormGroup, Button, Form } from 'reactstrap';
import { TextInput, SelectInput, QuestionInput } from './inputs';
import { getDomains } from '../../actions/domainActions';

class QuestionForm extends Component {
  componentWillMount() {
    const { id } = this.props.match.params;

    this.props.getDomains(id);
  }

  getDomainOptions() {
    return this.props.domains.map(domain => ({ value: domain.id, label: domain.title }));
  }

  render() {
    const { handleSubmit, pristine, submitting, loading, domainsLoading, match: { params: { id }} } = this.props;

    return (
      <Form onSubmit={handleSubmit} id="question-form">
        <Field
          component={SelectInput}
          name="domainId"
          label="Domain"
          loading={domainsLoading}
          options={this.getDomainOptions()}
        />
        <Field
          component={TextInput}
          name="stem"
          label="Stem"
          placeholder="e.g. What's the answer to life, the universe and everything?"
        />
        <FieldArray name="answers" component={QuestionInput} />
        <Field
          component={SelectInput}
          name="correctAnswers"
          label="Correct Alternative(s)"
          multi
          options={this.props.answers ? this.props.answers.map((answer, index) => ({
            value: alphabet.lower[index],
            label: `${alphabet.upper[index]}) ${answer}`
          })) : []}
        />
        <FormGroup className="d-flex justify-content-between">
          <Button tag={Link} color="default" to={`/admin/tests/${id}`}>
            <i className="fa fa-chevron-left" /> Go Back
          </Button>
          <Button color="primary" disabled={pristine || submitting || loading}>
            Submit {loading && <i className="fa fa-spinner fa-spin" />}
          </Button>
        </FormGroup>
      </Form>
    );
  }

}

const enhance = compose(
  connect(state => ({
    domains: state.domains.all,
    domainsLoading: state.domains.loading,
    answers: formValueSelector('questionForm')(state, 'answers')
  }), { getDomains }),
  reduxForm({ form: 'questionForm', enableReinitialize: true }),
  withRouter
);

export default enhance(QuestionForm);
