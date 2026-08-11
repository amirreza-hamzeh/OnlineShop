jest.mock('react-router', () => ({
  hashHistory: { replace: jest.fn() },
  Link: () => null,
}));

import { hashHistory } from 'react-router';
import { AuthContainer } from './AuthContainer';

const storedValues = {};
global.localStorage = {
  clear: () => Object.keys(storedValues).forEach(key => delete storedValues[key]),
  getItem: key => Object.prototype.hasOwnProperty.call(storedValues, key) ? storedValues[key] : null,
  setItem: (key, value) => { storedValues[key] = String(value); },
  removeItem: key => delete storedValues[key],
};

const location = { state: { returnTo: '/checkout?step=payment' } };

const makeContainer = overrides => new AuthContainer({
  mode: 'login',
  location,
  createCustomer: jest.fn(() => Promise.resolve({ value: {} })),
  loginCustomer: jest.fn(() => Promise.resolve({ value: { token: 'test-token' } })),
  ...overrides,
});

describe('full-page authentication flow', () => {
  beforeEach(() => {
    localStorage.clear();
    hashHistory.replace.mockClear();
  });

  it('stores the token and returns to the originating page after sign in', () => {
    const loginCustomer = jest.fn(() => Promise.resolve({ value: { token: 'signed-token' } }));
    const container = makeContainer({ loginCustomer });

    return container.handleLogin({ identifier: 'shopper@example.com', password: 'secret' }).then(() => {
      expect(loginCustomer).toHaveBeenCalledWith('shopper@example.com', 'secret');
      expect(localStorage.getItem('jwtToken')).toBe('signed-token');
      expect(hashHistory.replace).toHaveBeenCalledWith('/checkout?step=payment');
    });
  });

  it('creates an account, signs in by email, and then returns to the originating page', () => {
    const createCustomer = jest.fn(() => Promise.resolve({ value: { customerId: 42 } }));
    const loginCustomer = jest.fn(() => Promise.resolve({ value: { token: 'new-account-token' } }));
    const container = makeContainer({ mode: 'create', createCustomer, loginCustomer });

    return container.handleCreateUser({
      name: 'Shopper Jones',
      email: 'shopper@example.com',
      phone: '5551234567',
      password: 'secret',
    }).then(() => {
      expect(createCustomer).toHaveBeenCalledWith('Shopper Jones', 'shopper@example.com', '5551234567', 'secret');
      expect(loginCustomer).toHaveBeenCalledWith('shopper@example.com', 'secret');
      expect(localStorage.getItem('jwtToken')).toBe('new-account-token');
      expect(hashHistory.replace).toHaveBeenCalledWith('/checkout?step=payment');
    });
  });

  it('signs a phone-only account in with its phone number', () => {
    const createCustomer = jest.fn(() => Promise.resolve({ value: { customerId: 43 } }));
    const loginCustomer = jest.fn(() => Promise.resolve({ value: { token: 'phone-account-token' } }));
    const container = makeContainer({ mode: 'create', createCustomer, loginCustomer });

    return container.handleCreateUser({
      name: 'Phone Shopper',
      phone: '+1 555 123 4567',
      password: 'secret',
    }).then(() => {
      expect(createCustomer).toHaveBeenCalledWith('Phone Shopper', undefined, '+1 555 123 4567', 'secret');
      expect(loginCustomer).toHaveBeenCalledWith('+1 555 123 4567', 'secret');
    });
  });

  it('does not authenticate or redirect when the server omits the token', () => {
    const container = makeContainer({
      loginCustomer: jest.fn(() => Promise.resolve({ value: {} })),
    });

    return container.handleLogin({ identifier: 'shopper@example.com', password: 'secret' })
      .then(() => { throw new Error('Expected sign in to fail'); })
      .catch(error => {
        expect(error.errors._error).toBe('We could not sign you in with those details.');
        expect(localStorage.getItem('jwtToken')).toBe(null);
        expect(hashHistory.replace).not.toHaveBeenCalled();
      });
  });
});
