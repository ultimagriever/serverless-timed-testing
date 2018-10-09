import React, { Component } from 'react';
import Select from 'react-select';
import BaseInput from './BaseInput';

class SelectInput extends Component {
  static defaultProps = {
    multi: false,
    loading: false,
    options: [],
    disabled: false
  };

  render() {
    const { input, disabled, options, loading, multi, ...props } = this.props;

    const { meta: { touched, error, warning } } = props;

    const isValid = !(error || warning);

    return (
      <BaseInput {...props}>
        <Select
          {...input}
          options={options}
          isLoading={loading}
          isDisabled={disabled}
          isMulti={multi}
          isSearchable
          onBlurResetsInput={false}
          onSelectResetsInput={false}
          onBlur={() => input.onBlur(input.value)}
        />
      </BaseInput>
    )
  }
}

export default SelectInput;
