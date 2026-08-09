import validate, { isValidCardNumber, isValidExpirationDate } from './validate'

describe('payment form validation', () => {
  it('accepts a valid Luhn card number and rejects an invalid number', () => {
    expect(isValidCardNumber('4242 4242 4242 4242')).toBe(true)
    expect(isValidCardNumber('4242 4242 4242 4241')).toBe(false)
  })

  it('rejects malformed and expired expiration dates', () => {
    expect(isValidExpirationDate('13/99')).toBe(false)
    expect(isValidExpirationDate('01/20')).toBe(false)
  })

  it('requires all payment and billing fields', () => {
    expect(validate({})).toEqual({
      firstName: 'First name is required',
      lastName: 'Last name is required',
      cardNumber: 'Enter a valid card number',
      expirationDate: 'Enter a valid future date',
      cvv: 'Enter 3 or 4 digits',
      address: 'Street address is required',
      city: 'City is required',
      zipCode: 'Enter a valid ZIP code'
    })
  })
})
