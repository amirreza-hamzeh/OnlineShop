const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  if (!values.email && !values.phone) {
    errors.email = 'Enter an email address or phone number';
    errors.phone = 'Enter an email address or phone number';
  } else if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (values.phone && values.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Enter a valid phone number';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

export default validate;
