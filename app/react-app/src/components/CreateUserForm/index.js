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
    return (
      <div>
        <div className="authEyebrow">Join the crew</div>
        <h1 className="authTitle">Create your account</h1>
        <p className="authSubtitle">Enter your name and either an email address or phone number.</p>
        <div className='createFormRow'>
          <Field
            name="name"
            component={renderInput}
            id="create-name"
            label="Name"
            hintText="Enter your full name"
            autoComplete="name"
          />
          <Field
            name="email"
            component={renderInput}
            type="email"
            id="create-email"
            label="Email address (optional)"
            hintText="you@example.com"
            autoComplete="email"
          />
          <Field
            name="phone"
            component={renderInput}
            type="tel"
            id="create-phone"
            label="Phone number (optional)"
            hintText="5551234567"
            autoComplete="tel"
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
      backgroundColor: '#0f766e',
      borderRadius: '10px',
      height: '50px',
      width: '100%',
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
      error,
    } = this.props;

    const err = error ? <span className='errorMessage'>{error}</span> : null;

    return (
      <div className='authCard authCardCreate createFormContent'>
        <aside className="authAside" aria-hidden="true">
          <div className="authBrandMark">A</div>
          <div>
            <span className="authAsideLabel">AT SEA SHOP</span>
            <h2>Everything you love, one account away.</h2>
            <ul className="authBenefits">
              <li>Quicker, simpler checkout</li>
              <li>Secure account access</li>
              <li>A seamless shopping journey</li>
            </ul>
          </div>
        </aside>
        <div className="authPanel">
          <form onSubmit={handleSubmit}>
            {this.renderCreateUser()}
            {err}
            {this.renderButtons()}
          </form>
          <p className="authFinePrint">By creating an account, you agree to our terms and privacy policy.</p>
        </div>
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
