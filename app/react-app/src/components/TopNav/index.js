import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';
import Logo from '../Logo';
import './styles.css';
import '../globalStyles.css';
import { getJwtToken, removeJwtToken } from '../../actions/storage';
import { createAuthLocation } from '../../authNavigation';

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: getJwtToken() !== null };
  }

  renderUnauthenticated() {
    const styles = { color: '#fff' };
    const labelStyles = {
      textTransform: 'none',
      fontFamily: 'Open Sans',
      fontWeight: 600,
    };

    return (
      <div>
        <FlatButton
          containerElement={<Link to={createAuthLocation('/create-account', this.props.location)} />}
          style={styles}
          labelStyle={labelStyles}
          label="Create User"
        />
        <FlatButton
          containerElement={<Link to={createAuthLocation('/sign-in', this.props.location)} />}
          style={styles}
          labelStyle={labelStyles}
          label="Sign in"
        />
      </div>
    );
  }

  renderAuthenticated() {
    const styles = { color: '#fff' };
    const labelStyles = {
      textTransform: 'none',
      fontFamily: 'Open Sans',
      fontWeight: 600,
    };
    return (
      <div className="authenticatedNav">
        <Link to="/profile" className="accountMenu" aria-label="Open my profile">
          <span className="accountAvatar">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M12 12c2.5 0 4.5-2.1 4.5-4.6S14.5 3 12 3 7.5 4.9 7.5 7.4 9.5 12 12 12Zm0 2c-4 0-7 2.1-7 4.9V21h14v-2.1c0-2.8-3-4.9-7-4.9Z" />
            </svg>
          </span>
          <span className="accountCopy">
            <span className="accountGreeting">Hello, welcome back</span>
            <span className="accountLabel">My Profile</span>
          </span>
          <span className="accountChevron" aria-hidden="true">&#8250;</span>
        </Link>
        <FlatButton
          className="signOutButton"
          style={styles}
          labelStyle={labelStyles}
          onClick={this.removeToken}
          label="Sign out"
        />
      </div>
    );
  }

  removeToken = () => {
    removeJwtToken();
    this.setState({ authenticated: false });
  };

  render() {
    return (
      <div className={`globalContainer${this.props.solid ? ' solidNav' : ''}`}>
        <div className="navHeader">
          <div className="navLogo"><Logo /></div>
          <div className="navUser">
            <div className="buttonSection">
              {this.state.authenticated ? this.renderAuthenticated() : this.renderUnauthenticated()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TopNav.propTypes = {
  location: PropTypes.object,
  solid: PropTypes.bool,
};

TopNav.defaultProps = {
  location: { pathname: '/' },
  solid: false,
};

export default TopNav;
