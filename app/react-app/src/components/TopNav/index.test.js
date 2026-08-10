import React from 'react';
import { shallow } from 'enzyme';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';
import TopNav from './index';

global.localStorage = {
  getItem: jest.fn(() => null),
};

const clickAuthButton = label => {
  const router = {
    createHref: jest.fn(location => `#${location.pathname}`),
    isActive: jest.fn(() => false),
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    setRouteLeaveHook: jest.fn(),
  };
  const button = shallow(<TopNav location={{ pathname: '/checkout', search: '?step=payment' }} />).find(FlatButton)
    .filterWhere(candidate => candidate.prop('label') === label);
  const link = shallow(button.prop('containerElement'), { context: { router } });

  link.find('a').simulate('click', {
    button: 0,
    preventDefault: jest.fn(),
  });

  return router.push;
};

describe('TopNav authentication links', () => {
  it('navigates to account creation when Create User is clicked', () => {
    expect(clickAuthButton('Create User')).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/create-account',
      state: { returnTo: '/checkout?step=payment' },
    }));
  });

  it('navigates to login when Sign in is clicked', () => {
    expect(clickAuthButton('Sign in')).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/sign-in',
      state: { returnTo: '/checkout?step=payment' },
    }));
  });

  it('presents an accessible profile control when authenticated', () => {
    const nav = shallow(<TopNav />);
    nav.setState({ authenticated: true });
    const profileLink = nav.find(Link).filterWhere(link => link.prop('to') === '/profile');

    expect(profileLink.hasClass('accountMenu')).toBe(true);
    expect(profileLink.prop('aria-label')).toBe('Open my profile');
    expect(profileLink.find('.accountLabel').text()).toBe('My Profile');
    expect(profileLink.find('svg').prop('aria-hidden')).toBe('true');
  });

  it('can render on a solid navigation surface outside the home hero', () => {
    const nav = shallow(<TopNav solid />);

    expect(nav.find('.globalContainer').hasClass('solidNav')).toBe(true);
  });
});
