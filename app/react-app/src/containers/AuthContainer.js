import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import { SubmissionError } from 'redux-form';
import CreateUserForm from '../components/CreateUserForm';
import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';
import { createCustomer, loginCustomer } from '../actions';
import { setJwtToken } from '../actions/storage';
import { createAuthLocation, getReturnPath } from '../authNavigation';
import './AuthContainer.css';

class AuthContainer extends Component {
  finishLogin = ({ value: { token } }) => {
    setJwtToken(token);
    hashHistory.replace(getReturnPath(this.props.location));
  };

  handleLogin = ({ identifier, password }) => this.props.loginCustomer(identifier, password)
    .then(this.finishLogin)
    .catch(() => {
      throw new SubmissionError({ _error: 'We could not sign you in with those details.' });
    });

  handleCreateUser = ({ username, email, phone, password }) => this.props.createCustomer(
    username, email, phone, password
  ).then(() => this.props.loginCustomer(email, password)
    .then(this.finishLogin)
    .catch(() => {
      throw new SubmissionError({ _error: 'Your account was created, but we could not sign you in.' });
    }), () => {
      throw new SubmissionError({ _error: 'That username, email address, or phone number is already in use.' });
    });

  render() {
    const isCreate = this.props.mode === 'create';
    return (
      <main className="authPage">
        <header className="authPageHeader">
          <Link to={getReturnPath(this.props.location)} className="authPageLogo" aria-label="Return to shop">
            <Logo />
          </Link>
          <Link to={getReturnPath(this.props.location)} className="authBackLink">← Back to shop</Link>
        </header>
        <div className="authPageBody">
          {isCreate
            ? <CreateUserForm onSubmit={this.handleCreateUser} />
            : <LoginForm onSubmit={this.handleLogin} />}
          <p className="authSwitchPrompt">
            {isCreate ? 'Already have an account?' : 'New to At Sea Shop?'}{' '}
            <Link to={createAuthLocation(isCreate ? '/sign-in' : '/create-account', {
              pathname: getReturnPath(this.props.location),
            })}>
              {isCreate ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </main>
    );
  }
}

AuthContainer.propTypes = {
  mode: PropTypes.oneOf(['create', 'login']).isRequired,
  location: PropTypes.object.isRequired,
  createCustomer: PropTypes.func.isRequired,
  loginCustomer: PropTypes.func.isRequired,
};

export default connect(null, { createCustomer, loginCustomer })(AuthContainer);
