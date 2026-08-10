const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!values.phone) {
    errors.phone = 'Required';
  } else if (values.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Enter a valid phone number';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

export default validate;
