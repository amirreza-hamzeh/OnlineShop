export const cardDigits = value => (value || '').replace(/\D/g, '').slice(0, 19)

export const getCardBrand = value => {
  const digits = cardDigits(value)
  if (/^4/.test(digits)) return 'Visa'
  const firstSix = Number(digits.slice(0, 6))
  if (/^5[1-5]/.test(digits) || (digits.length >= 6 && firstSix >= 222100 && firstSix <= 272099)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'American Express'
  return ''
}

export const isValidCardLength = value => {
  const length = cardDigits(value).length
  const brand = getCardBrand(value)
  if (brand === 'Visa') return [13, 16, 19].indexOf(length) !== -1
  if (brand === 'Mastercard') return length === 16
  if (brand === 'American Express') return length === 15
  return false
}

export const formatCardNumber = value => {
  const digits = cardDigits(value)
  const groups = /^3[47]/.test(digits) ? [4, 6, 5] : [4, 4, 4, 4, 3]
  let offset = 0
  return groups.map(size => {
    const group = digits.slice(offset, offset + size)
    offset += size
    return group
  }).filter(Boolean).join(' ')
}

export const formatExpirationDate = value => {
  let digits = (value || '').replace(/\D/g, '').slice(0, 4)
  if (digits.length && Number(digits[0]) > 1) digits = `0${digits}`.slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
}

export const formatSecurityCode = value => (value || '').replace(/\D/g, '').slice(0, 4)
