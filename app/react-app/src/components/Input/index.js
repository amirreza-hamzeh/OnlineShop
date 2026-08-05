import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';
import './styles.css';

const Input = ({ type, field, hintText, label, id, autoComplete }) => {
  const inputId = id || field.input.name;
  const errorText = field.meta.touched && field.meta.error;

  return (
    <div className="formField">
      {label ? <label className="formLabel" htmlFor={inputId}>{label}</label> : null}
      <TextField
        id={inputId}
        type={type}
        hintText={hintText}
        errorText={errorText}
        autoComplete={autoComplete}
        fullWidth={true}
        aria-invalid={Boolean(errorText)}
        {...field.input}
      />
    </div>
  );
}

Input.propTypes = {
  field: PropTypes.object.isRequired,
  hintText: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  autoComplete: PropTypes.string,
  type: PropTypes.string,
}

export default Input
