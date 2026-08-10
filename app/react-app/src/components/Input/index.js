import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';
import './styles.css';

const textFieldStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #dbe3ed',
  borderRadius: '10px',
  height: '50px',
  padding: '0 14px',
};
const inputStyle = { color: '#0f172a', fontFamily: 'Open Sans', height: '48px' };
const underlineStyle = { bottom: '-1px', left: '10px', right: '10px', width: 'auto' };
const underlineFocusStyle = { borderColor: '#0f766e' };

const Input = ({ type, field, hintText, label, id, autoComplete, inputMode, maxLength, helperText }) => {
  const inputId = id || field.input.name;
  const errorText = field.meta.touched && field.meta.error;
  const helperId = `${inputId}-helper`;

  return (
    <div className="formField">
      {label ? <label className="formLabel" htmlFor={inputId}>{label}</label> : null}
      <TextField
        id={inputId}
        type={type}
        hintText={hintText}
        errorText={errorText}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        fullWidth={true}
        style={textFieldStyle}
        inputStyle={inputStyle}
        underlineStyle={underlineStyle}
        underlineFocusStyle={underlineFocusStyle}
        aria-invalid={Boolean(errorText)}
        aria-describedby={helperText && !errorText ? helperId : undefined}
        {...field.input}
      />
      {helperText && !errorText ? <span className="formHelper" id={helperId}>{helperText}</span> : null}
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
  inputMode: PropTypes.string,
  maxLength: PropTypes.number,
  helperText: PropTypes.node,
}

export default Input
