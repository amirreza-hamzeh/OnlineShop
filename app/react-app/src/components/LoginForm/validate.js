const validate = values => {
  const errors = {};
  if (!values.identifier) {
    errors.identifier = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

export default validate;
