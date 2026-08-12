import { cardDigits, isValidCardLength } from './cardFields'

export const isValidCardNumber = value => {
  const digits = cardDigits(value)
  if (!isValidCardLength(value) || /^0+$/.test(digits)) return false

  let sum = 0
  let doubleDigit = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (doubleDigit) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    doubleDigit = !doubleDigit
  }
  return sum % 10 === 0
}

export const isValidExpirationDate = value => {
  const match = /^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/.exec(value || '')
  if (!match) return false

  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  return year > currentYear || (year === currentYear && month >= currentMonth)
}

const validate = values => {
  const errors = {}
  if (!values.firstName || !values.firstName.trim()) errors.firstName = 'First name is required'
  if (!values.lastName || !values.lastName.trim()) errors.lastName = 'Last name is required'
  if (!isValidCardNumber(values.cardNumber)) errors.cardNumber = 'Enter a valid card number'
  if (!isValidExpirationDate(values.expirationDate)) errors.expirationDate = 'Enter a valid future date'
  if (!/^\d{3,4}$/.test(values.cvv || '')) errors.cvv = 'Enter 3 or 4 digits'
  if (!values.address || !values.address.trim()) errors.address = 'Street address is required'
  if (!values.city || !values.city.trim()) errors.city = 'City is required'
  if (!/^\d{10}(-\d{4})?$/.test(values.zipCode || '')) errors.zipCode = 'Enter a valid Postal code'
  return errors
}

export default validate
