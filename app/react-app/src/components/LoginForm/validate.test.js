import validate from './validate';

describe('login validation', () => {
  it('requires an email or phone identifier and password', () => {
    expect(validate({})).toEqual({ identifier: 'Required', password: 'Required' });
  });

  it('accepts credentials for submission', () => {
    expect(validate({ identifier: 'shopper@example.com', password: 'secret' })).toEqual({});
    expect(validate({ identifier: '+1 555 123 4567', password: 'secret' })).toEqual({});
  });
});
