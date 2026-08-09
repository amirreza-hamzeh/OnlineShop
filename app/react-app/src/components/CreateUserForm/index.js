import React, { PropTypes, Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FlatButton } from 'material-ui';
import Input from '../Input';
import './styles.css';
import validate from './validate.js';

// Keep the Field component type stable between Redux Form updates. Defining this
// renderer inline causes React to remount the input after every keystroke, which
// drops the browser's focus and makes the cursor disappear.
const renderInput = props => <Input field={props} {...props} />;

class CreateUserForm extends Component {

  renderCreateUser() {
    const header = 'Create your user ID'
    return (
      <div>
        <div className='createFormHeader'>
          {header}
        </div>
        <div className='createFormRow'>
          <Field
            name="username"
            component={renderInput}
            id="create-username"
            label="Username"
            hintText="Choose a user ID"
            autoComplete="username"
          />
          <Field
            name="password"
            component={renderInput}
            type="password"
            id="create-password"
            label="Password"
            hintText="Choose a password"
            autoComplete="new-password"
          />
        </div>
      </div>
    );
  }

  renderButtons() {
    const { handleSubmit } = this.props
    const labelStyles = {
      textTransform: 'none',
      fontFamily: 'Open Sans',
      fontWeight: 600,
    };
    const styles = {
      color: '#fff',
      backgroundColor: '#099CEC',
    };

    return (
      <div className='createFormButton'>
        <FlatButton
          label="Sign up"
          type="submit"
          keyboardFocused={false}
          onClick={handleSubmit}
          style={styles}
          labelStyle={labelStyles}
        />
      </div>
    );
  }

  render() {
    const {
      handleSubmit,
    } = this.props;

    return (
      <div className='createFormContent'>
        <form onSubmit={handleSubmit}>
          {this.renderCreateUser()}
          {this.renderButtons()}
        </form>
      </div>
    );
  }
}

CreateUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default CreateUserForm = reduxForm({
  form: 'createUserForm',
  validate,
})(CreateUserForm);
