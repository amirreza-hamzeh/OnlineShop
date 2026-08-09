import React, { PropTypes, Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FlatButton } from 'material-ui';
import Input from '../Input';
import './styles.css';
import validate from './validate.js'

const renderInput = props => <Input field={props} {...props} />;

class LoginForm extends Component {

  renderLogin() {
    return (
      <div>
        <div className="authEyebrow">Welcome back</div>
        <h1 className="authTitle">Sign in to your account</h1>
        <p className="authSubtitle">Pick up where you left off and get back to shopping.</p>
          <div className='loginFormRow'>
          <Field
            name="identifier"
            component={renderInput}
            id="login-identifier"
            label="Email address or phone number"
            hintText="you@example.com or 5551234567"
            autoComplete="username"
         />
          <Field
            name="password"
            component={renderInput}
            type="password"
            id="login-password"
            label="Password"
            hintText="Password"
            autoComplete="current-password"
         />
         </div>
      </div>
    );
  }

  renderButtons() {
    const { handleSubmit } = this.props
    const styles = {
      color: '#fff',
      backgroundColor: '#0f172a',
      borderRadius: '10px',
      height: '50px',
      width: '100%',
    };
    const labelStyles = {
      textTransform: 'none',
      fontFamily: 'Open Sans',
      fontWeight: 600,
    };

    return(
      <div className='loginFormButton'>
        <FlatButton
          label="Sign in"
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

    const err = error ? <span className='errorMessage'>{error}</span> : null

    return (
      <div className='authCard authCardLogin loginFormContent'>
        <aside className="authAside" aria-hidden="true">
          <div className="authBrandMark">A</div>
          <div>
            <span className="authAsideLabel">AT SEA SHOP</span>
            <h2>Your next favorite find is waiting.</h2>
            <p>Sign in securely with the email address or phone number linked to your account.</p>
          </div>
          <div className="authAsideBadge">Secure checkout</div>
        </aside>
        <div className="authPanel">
          <form onSubmit={handleSubmit}>
            {this.renderLogin()}
            {err}
            {this.renderButtons()}
          </form>
          <p className="authFinePrint">Your account details are encrypted and kept private.</p>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default LoginForm = reduxForm({
  form: 'loginForm',
  validate,
})(LoginForm);
