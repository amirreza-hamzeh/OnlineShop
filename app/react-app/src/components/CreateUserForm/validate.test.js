import validate from './validate';

describe('create user validation', () => {
  it('requires every credential used to create and access an account', () => {
    expect(validate({})).toEqual({
      username: 'Required',
      email: 'Required',
      phone: 'Required',
      password: 'Required',
    });
  });

  it('rejects malformed contact details', () => {
    expect(validate({ username: 'shopper', email: 'invalid', phone: '123', password: 'secret' })).toEqual({
      email: 'Enter a valid email address',
      phone: 'Enter a valid phone number',
    });
  });

  it('accepts valid account details', () => {
    expect(validate({ username: 'shopper', email: 'shopper@example.com', phone: '+1 555 123 4567', password: 'secret' })).toEqual({});
  });
});
