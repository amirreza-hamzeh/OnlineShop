import { emptyProfileAddress, formatProfileAddress, parseProfileAddress } from './profileAddress'

describe('saved profile addresses', () => {
  const address = {
    street: '123 Market Street\nApartment 4B', city: 'Seattle', region: 'WA', postalCode: '98101', country: 'United States'
  }

  it('round trips a structured delivery address', () => {
    expect(parseProfileAddress(formatProfileAddress(address))).toEqual(address)
  })

  it('keeps a legacy address available as the street', () => {
    expect(parseProfileAddress('123 Market Street')).toEqual({ ...emptyProfileAddress(), street: '123 Market Street' })
  })

  it('treats the registration placeholder as empty', () => {
    expect(parseProfileAddress('Not provided')).toEqual(emptyProfileAddress())
  })
})
