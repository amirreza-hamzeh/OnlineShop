import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { hashHistory } from 'react-router';
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

  openAuthPage = pathname => {
    hashHistory.push(createAuthLocation(pathname, hashHistory.getCurrentLocation()));
  };

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
          style={styles}
          labelStyle={labelStyles}
          onClick={() => this.openAuthPage('/create-account')}
          label="Create User"
        />
        <FlatButton
          style={styles}
          labelStyle={labelStyles}
          onClick={() => this.openAuthPage('/sign-in')}
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

export default TopNav;
