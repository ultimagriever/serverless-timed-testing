import React from 'react';
import { Input } from 'reactstrap';
import BaseInput from './BaseInput';

function TextInput(props) {
  const { input, ...rest } = props;

  const { type, placeholder, disabled, meta: { touched, error, warning } } = props;

  const isValid = !(error || warning);

  return (
    <BaseInput {...rest}>
      <Input
        type={type}
        id={input.name}
        placeholder={placeholder}
        valid={touched ? isValid : undefined}
        invalid={touched ? !isValid : undefined}
        disabled={disabled}
        {...input}
      />
    </BaseInput>
  );
}

TextInput.defaultProps = {
  type: "text"
};

export default TextInput;
