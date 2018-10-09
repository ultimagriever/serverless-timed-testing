import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import alphabet from 'alphabet';
import RequireAccessLevel from '../../../../hoc/RequireAccessLevel';
import QuestionForm from '../../../forms/QuestionForm';
import {createQuestion} from '../../../../actions/questionActions';

class NewQuestion extends Component {
  handleSubmit = async values => {
    const { id: testId } = this.props.match.params;

    const params = {
      ...values,
      answers: values.answers.reduce((prev, curr, index) => Object.assign({}, prev, { [alphabet.lower[index]]: curr }), {}),
      correctAnswers: values.correctAnswers.map(val => val.value),
      domainId: values.domainId.value,
      testId
    };

    await this.props.createQuestion(params);
    this.props.history.push(`/admin/tests/${testId}`);
  };

  render() {
    const { id } = this.props.match.params;

    return (
      <QuestionForm
        loading={this.props.loading}
        testId={id}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const enhance = compose(
  RequireAccessLevel('user'),
  connect(state => ({ loading: state.questions.loading }), { createQuestion })
);

export default enhance(NewQuestion);
