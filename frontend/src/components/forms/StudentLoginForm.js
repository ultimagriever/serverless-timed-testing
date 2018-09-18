import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Button, FormGroup } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/pt-br';
import TextInput from './inputs/TextInput';
import {requestOneTimePassword} from '../../helpers/studentAuth';
import { authenticateStudent } from '../../actions/studentAuthActions';

class StudentLoginForm extends Component {
  state = {
    codeValid: false,
    codeTimestamp: null,
    sending: false
  };

  codeExpiration = null;

  interval = null;

  handleSubmit = async values => {
    this.setState(() => ({ sending: true }));

    if (!values.code) {
      const success = await requestOneTimePassword(values.phone);

      if (success) {
        this.setState(() => ({ sending: false }));
        return this.startCountdown();
      }
    }

    clearInterval(this.interval);
    await this.props.authenticateStudent(values);
    this.props.history.push('/');
  };

  startCountdown() {
    this.codeExpiration = moment().add(5, 'minutes');

    this.setState(() => ({ codeValid: true, codeTimestamp: moment() }));

    this.interval = setInterval(() => {
      if (this.codeExpiration.diff(this.state.codeTimestamp, 'minutes', true) <= 0) {
        this.setState(() => ({ codeValid: false }));
        return clearInterval(this.interval);
      }

      this.setState(() => ({ codeTimestamp: moment() }))
    }, 1000);
  }

  renderHelpBlock() {
    if (this.state.codeValid) {
      const duration = moment.duration(this.codeExpiration.diff(this.state.codeTimestamp));

      return `Expiring in: ${moment.utc(duration.asMilliseconds()).format('mm:ss')}`;
    }

    if (this.state.codeTimestamp && !this.state.codeValid) {
      return "Code expired.";
    }
  }

  render() {
    const { pristine, submitting, handleSubmit } = this.props;
    const { sending, codeValid } = this.state;

    return (
      <Form onSubmit={handleSubmit(this.handleSubmit)} id="student-login-form">
        <Field
          component={TextInput}
          name="phone"
          type="text"
          label="Phone Number"
        />
        <Field
          component={TextInput}
          name="code"
          type="password"
          label="SMS Code"
          helpBlock={this.renderHelpBlock()}
          disabled={sending || !codeValid}
        />
        <FormGroup className="text-center">
          <Button color="primary" disabled={pristine || submitting || sending}>
            Log in {sending && <i className="fa fa-spinner fa-spin" />}
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

const enhance = compose(
  connect(null, { authenticateStudent }),
  reduxForm({
    form: 'studentLogin'
  }),
  withRouter
);

export default enhance(StudentLoginForm);
