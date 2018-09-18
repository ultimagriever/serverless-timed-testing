import React from 'react';
import { FormGroup, Label, FormText, FormFeedback } from 'reactstrap';

export default function BaseInput({ label, helpBlock, meta: { touched, error, warning }, children }) {
  const isValid = !(error || warning);

  return (
    <FormGroup>
      {label && <Label for={label}>{label}</Label>}
      {children}
      {touched && <FormFeedback valid={isValid}>{error || warning}</FormFeedback>}
      {helpBlock && <FormText color="muted">{helpBlock}</FormText>}
    </FormGroup>
  );
}
