import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getQuestionById, updateQuestion } from '../../../../actions/questionActions';
import RequireAccessLevel from '../../../../hoc/RequireAccessLevel';
import QuestionForm from '../../../forms/QuestionForm';
import alphabet from 'alphabet';

class EditQuestion extends Component {
  componentWillMount() {
    const { id: testId, questionId } = this.props.match.params;

    this.props.getQuestionById({ testId, questionId })
  }
  handleSubmit = async ({ testId, ...values }) => {
    const { questionId, id } = this.props.match.params;

    const params = {
      ...values,
      answers: values.answers.reduce((prev, curr, index) => Object.assign({}, prev, { [alphabet.lower[index]]: curr }), {}),
      correctAnswers: values.correctAnswers.map(val => val.value),
      domainId: values.domainId.value,
      testId: id,
      questionId
    };

    await this.props.updateQuestion(params);

    this.props.history.push(`/admin/tests/${testId}`);
  };

  render() {
    const { question } = this.props;

    const initialValues = Object.keys(question).length ? {
      ...question,
      answers: Object.values(question.answers),
      correctAnswers: question.correctAnswers.values.map(ca => ({
        value: ca,
        label: `${ca.toUpperCase()}) ${question.answers[ca]}`
      })),
      domainId: {
        value: question.domain.id,
        label: question.domain.title
      }
    } : {};

    return (
      <QuestionForm
        initialValues={initialValues}
        loading={this.props.loading}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const enhance = compose(
  RequireAccessLevel('user'),
  connect(state => ({ question: state.questions.one, loading: state.questions.loading }), { getQuestionById, updateQuestion })
);

export default enhance(EditQuestion);
