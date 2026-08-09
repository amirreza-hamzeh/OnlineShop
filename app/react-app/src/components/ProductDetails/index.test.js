import React from 'react'
import { shallow } from 'enzyme'
import ProductDetails, { formatPrice, getDeliveryDate, numericPrice } from './index'

const product = {
  productId: 7,
  name: 'Test product',
  brand: 'Test brand',
  category: 'Home',
  price: '19.5',
  originalPrice: '25',
  rating: 4.5,
  reviewCount: 4,
  inventory: 3,
  tags: [],
  image: '/images/7.png'
}

describe('product detail helpers', () => {
  let originalWindow

  beforeEach(() => {
    originalWindow = global.window
    global.window = { scrollTo: jest.fn() }
  })

  afterEach(() => {
    if (originalWindow) global.window = originalWindow
    else delete global.window
  })

  it('formats numeric and API string prices safely', () => {
    expect(formatPrice(34)).toBe('$34.00')
    expect(formatPrice('49.5')).toBe('$49.50')
    expect(numericPrice(undefined)).toBe(0)
    expect(formatPrice('not-a-price')).toBe('$0.00')
  })

  it('calculates delivery relative to the current date', () => {
    expect(getDeliveryDate(new Date(2026, 7, 9, 12))).toBe('Wednesday, August 12')
  })

  it('renders API string prices and adds the selected quantity', () => {
    const addToCart = jest.fn()
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={addToCart} />)

    expect(wrapper.find('.detailPrice').text()).toContain('$19.50')
    wrapper.setState({ quantity: 3 })
    wrapper.find('.addCartButton').simulate('click')
    expect(addToCart).toHaveBeenCalledTimes(3)
    expect(addToCart).toHaveBeenCalledWith(7)
  })

  it('distinguishes loading, missing, and unavailable products', () => {
    const addToCart = jest.fn()
    expect(shallow(<ProductDetails productsLoaded={false} addToCart={addToCart} />).text()).toContain('Loading product')
    expect(shallow(<ProductDetails productsLoaded addToCart={addToCart} />).text()).toContain('Product not found')

    const wrapper = shallow(<ProductDetails product={{ ...product, inventory: 0 }} productsLoaded addToCart={addToCart} />)
    expect(wrapper.find('.stockStatus').text()).toBe('Temporarily out of stock')
    expect(wrapper.find('.addCartButton').prop('disabled')).toBe(true)
    expect(wrapper.find('.buyNowButton').prop('disabled')).toBe(true)
  })

  it('returns to the top when the product page opens or changes products', () => {
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={jest.fn()} />)
    wrapper.instance().componentDidMount()
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)

    window.scrollTo.mockClear()
    wrapper.instance().props = { ...wrapper.instance().props, product: { ...product, productId: 8 } }
    wrapper.instance().componentDidUpdate({ product })
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
