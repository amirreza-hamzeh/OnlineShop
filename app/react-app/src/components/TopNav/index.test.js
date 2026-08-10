import React from 'react';
import { shallow } from 'enzyme';
import FlatButton from 'material-ui/FlatButton';
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
});
