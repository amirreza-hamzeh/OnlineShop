import { createAuthLocation, getReturnPath } from './authNavigation';

describe('authentication navigation', () => {
  it('remembers the complete page that opened authentication', () => {
    expect(createAuthLocation('/sign-in', { pathname: '/checkout', search: '?step=payment' })).toEqual({
      pathname: '/sign-in',
      state: { returnTo: '/checkout?step=payment' },
    });
  });

  it('returns to the remembered page after authentication', () => {
    expect(getReturnPath({ state: { returnTo: '/checkout?step=payment' } })).toBe('/checkout?step=payment');
  });

  it('uses the storefront for missing, external, or auth-page destinations', () => {
    expect(getReturnPath()).toBe('/');
    expect(getReturnPath({ state: { returnTo: '//example.com' } })).toBe('/');
    expect(getReturnPath({ state: { returnTo: '/sign-in' } })).toBe('/');
  });
});
