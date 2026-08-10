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
      <div>
        <span className="welcomeMessage">Welcome!</span>
        <FlatButton
          containerElement={<Link to="/profile" />}
          style={styles}
          labelStyle={labelStyles}
          label="My profile"
        />
        <FlatButton
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
      <div className="globalContainer">
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
};

TopNav.defaultProps = {
  location: { pathname: '/' },
};

export default TopNav;
