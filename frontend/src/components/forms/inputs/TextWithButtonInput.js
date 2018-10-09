import React from 'react';
import { Input, InputGroupAddon, InputGroup, Button } from 'reactstrap';
import BaseInput from './BaseInput';

function TextWithButtonInput(props) {
  const { input, ...rest } = props;

  const { type, placeholder, disabled, btnSide, onBtnClick, btnColor, btnLabel, meta: { touched, error, warning } } = props;

  const isValid = !(error || warning);

  return (
    <BaseInput {...rest}>
      <InputGroup>
        {
          btnSide === "prepend" && (
            <InputGroupAddon addonType={btnSide}>
              <Button color={btnColor} onClick={onBtnClick}>
                {btnLabel}
              </Button>
            </InputGroupAddon>
          )
        }
        <Input
          type={type}
          id={input.name}
          placeholder={placeholder}
          valid={touched ? isValid : undefined}
          invalid={touched ? !isValid : undefined}
          disabled={disabled}
          {...input}
        />
        {
          btnSide === "append" && (
            <InputGroupAddon addonType={btnSide}>
              <Button color={btnColor} onClick={onBtnClick}>
                {btnLabel}
              </Button>
            </InputGroupAddon>
          )
        }
      </InputGroup>
    </BaseInput>
  );
}

TextWithButtonInput.defaultProps = {
  type: "text",
  btnSide: "append",
  onBtnClick: () => {},
  btnColor: "default",
  btnLabel: "Button"
};

export default TextWithButtonInput;
