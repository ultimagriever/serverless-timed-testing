import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getQuestions, deleteQuestion } from '../../../../actions/questionActions';
import Loading from '../../../common/Loading';

class ListQuestions extends Component {
  deleteQuestion = questionId => {
    const { testId } = this.props;

    this.props.deleteQuestion({ testId, questionId });
  };

  componentWillMount() {
    const { testId } = this.props;

    this.props.getQuestions(testId);
  }

  render() {
    const { testId } = this.props;

    return (
      <Table striped responsive>
        <thead>
          <tr>
            <th>Domain</th>
            <th>Stem</th>
            <th>Correct Answers</th>
            <th colSpan={2} className="text-center">
              <Button color="primary" tag={Link} to={`/admin/tests/${testId}/questions/new`}>
                Create Question <i className="fa fa-plus" />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.questions.length ? this.props.questions.map(question => (
            <tr key={question.id}>
              <td>{question.domain.title}</td>
              <td>{question.stem}</td>
              <td>{question.correctAnswers.values.join(', ')}</td>
              <td>
                <Button color="link" tag={Link} to={`/admin/tests/${this.props.testId}/questions/${question.id}/edit`}>
                  <i className="fa fa-pencil" />
                </Button>
              </td>
              <td>
                <Button color="danger" onClick={() => this.deleteQuestion(question.id)}>
                  <i className="fa fa-times" />
                </Button>
              </td>
            </tr>
          )) : (
            <tr>
              {
                this.props.loading ? (
                  <td colSpan={5}>
                    <Loading />
                  </td>
                ) : (
                  <td colSpan={5} className="text-center">
                    No questions found. Would you like to&nbsp;
                    <Link to={`/admin/tests/${this.props.testId}/questions/new`}>
                      create a new one
                    </Link>?
                  </td>
                )
              }
            </tr>
          )
        }
        </tbody>
      </Table>
    );
  }
}

export default connect(state => ({
  questions: state.questions.all,
  loading: state.questions.loading
}), { getQuestions, deleteQuestion })(ListQuestions);
