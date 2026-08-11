import validate from './validate';

describe('create user validation', () => {
  it('requires every credential used to create and access an account', () => {
    expect(validate({})).toEqual({
      name: 'Required',
      email: 'Enter an email address or phone number',
      phone: 'Enter an email address or phone number',
      password: 'Required',
    });
  });

  it('rejects malformed contact details', () => {
    expect(validate({ name: 'Shopper Jones', email: 'invalid', phone: '123', password: 'secret' })).toEqual({
      email: 'Enter a valid email address',
      phone: 'Enter a valid phone number',
    });
  });

  it('accepts valid account details', () => {
    expect(validate({ name: 'Shopper Jones', email: 'shopper@example.com', phone: '+1 555 123 4567', password: 'secret' })).toEqual({});
  });

  it('accepts either contact identifier without requiring both', () => {
    expect(validate({ name: 'Email User', email: 'email@example.com', password: 'secret' })).toEqual({});
    expect(validate({ name: 'Phone User', phone: '5551234567', password: 'secret' })).toEqual({});
  });
});
