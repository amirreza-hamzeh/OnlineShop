import imageUrl from './imageUrl'
import products from '../api/products.json'

describe('imageUrl', () => {
  it('leaves secure and insecure remote image URLs unchanged', () => {
    expect(imageUrl('https://images.example.com/product.jpg'))
      .toBe('https://images.example.com/product.jpg')
    expect(imageUrl('http://images.example.com/product.jpg'))
      .toBe('http://images.example.com/product.jpg')
  })

  it('prefixes local image paths with the public URL', () => {
    expect(imageUrl('/images/product.png'))
      .toBe(`${process.env.PUBLIC_URL || ''}/images/product.png`)
  })

  it('returns an empty source when no image was provided', () => {
    expect(imageUrl()).toBe('')
    expect(imageUrl(null)).toBe('')
  })

  it('keeps every catalog product image as a valid HTTPS URL', () => {
    products.forEach(product => {
      expect(product.image).toMatch(/^https:\/\//)
      expect(imageUrl(product.image)).toBe(product.image)
    })
  })
})
