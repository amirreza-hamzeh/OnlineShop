import { formatCardNumber, formatExpirationDate, formatSecurityCode, getCardBrand, isValidCardLength } from './cardFields'

describe('payment field formatting', () => {
  it('formats typed or pasted card numbers and keeps only supported digits', () => {
    expect(formatCardNumber('4242-4242 4242abc4242')).toBe('4242 4242 4242 4242')
    expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005')
  })

  it('identifies the accepted card brands', () => {
    expect(getCardBrand('4242')).toBe('Visa')
    expect(getCardBrand('5555')).toBe('Mastercard')
    expect(getCardBrand('222100')).toBe('Mastercard')
    expect(getCardBrand('272099')).toBe('Mastercard')
    expect(getCardBrand('272100')).toBe('')
    expect(getCardBrand('3782')).toBe('American Express')
  })

  it('enforces the length advertised by each supported card brand', () => {
    expect(isValidCardLength('4242 4242 4242 4242')).toBe(true)
    expect(isValidCardLength('3782 822463 10005')).toBe(true)
    expect(isValidCardLength('3782 822463 1000')).toBe(false)
    expect(isValidCardLength('6011 1111 1111 1117')).toBe(false)
  })

  it('makes expiry and security code input forgiving', () => {
    expect(formatExpirationDate('9/29')).toBe('09 / 29')
    expect(formatExpirationDate('122030')).toBe('12 / 20')
    expect(formatSecurityCode('1a2-34')).toBe('1234')
  })
})
