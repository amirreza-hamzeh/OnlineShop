const emptyAddress = () => ({ street: '', city: '', region: '', postalCode: '', country: '' })

export const parseProfileAddress = value => {
  if (!value || value === 'Not provided') return emptyAddress()
  const lines = value.split('\n').map(line => line.trim()).filter(Boolean)
  if (lines.length < 3) return { ...emptyAddress(), street: value.trim() }

  const locality = lines[lines.length - 2]
  const localityMatch = /^(.+?),\s*([^,]+?)\s+(\d{5}(?:-\d{4})?)$/.exec(locality)
  if (!localityMatch) return { ...emptyAddress(), street: value.trim() }

  return {
    street: lines.slice(0, -2).join('\n'),
    city: localityMatch[1],
    region: localityMatch[2],
    postalCode: localityMatch[3],
    country: lines[lines.length - 1]
  }
}

export const formatProfileAddress = address => [
  address.street.trim(),
  `${address.city.trim()}, ${address.region.trim()} ${address.postalCode.trim()}`,
  address.country.trim()
].join('\n')

export const emptyProfileAddress = emptyAddress
