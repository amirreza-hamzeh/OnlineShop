import { categoryPath, productPath } from './catalogPath'

describe('catalog paths', () => {
  it('builds category and product paths', () => {
    expect(categoryPath('Tech')).toBe('/shop/Tech')
    expect(productPath('Tech', 7)).toBe('/shop/Tech/7')
  })

  it('escapes category names before adding them to the URL', () => {
    expect(categoryPath('Home & Garden')).toBe('/shop/Home%20%26%20Garden')
    expect(productPath('Health / Beauty', 3)).toBe('/shop/Health%20%2F%20Beauty/3')
  })
})
