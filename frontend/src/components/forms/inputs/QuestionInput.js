import React, { Component } from 'react';
import { Field } from 'redux-form';
import alphabet from 'alphabet';
import { Jumbotron, Button, ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import TextWithButtonInput from './TextWithButtonInput';

class QuestionInput extends Component {
  render() {
    const { fields } = this.props;

    return (
      <Jumbotron className="bg-light">
        <h3>Answer Choices</h3>
        <hr />
        <ListGroup>
          {
            fields.map((answer, index) => (
              <ListGroupItem key={index}>
                <ListGroupItemHeading>
                  Option {alphabet.upper[index]}
                </ListGroupItemHeading>
                <Field
                  name={answer}
                  component={TextWithButtonInput}
                  placeholder="e.g. 42"
                  btnColor="danger"
                  btnLabel={<i className="fa fa-times" />}
                  onBtnClick={() => fields.remove(index)}
                  onChange={this.handleChange}
                />
              </ListGroupItem>
            ))
          }
        </ListGroup>
        <hr />
        <Button color="primary" onClick={() => fields.push()}>
          Add Answer Choice
        </Button>
      </Jumbotron>
    )
  }
}

export default QuestionInput;
