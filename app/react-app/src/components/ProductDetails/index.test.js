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
  let originalLocalStorage

  beforeEach(() => {
    originalWindow = global.window
    originalLocalStorage = global.localStorage
    global.window = { scrollTo: jest.fn() }
  })

  afterEach(() => {
    if (originalWindow) global.window = originalWindow
    else delete global.window
    if (originalLocalStorage) global.localStorage = originalLocalStorage
    else delete global.localStorage
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

  it('links each breadcrumb level to the category page and shop home', () => {
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={jest.fn()} />)
    const breadcrumb = wrapper.find('.detailBreadcrumb')

    expect(breadcrumb.find('Link').at(0).prop('to')).toBe('/')
    expect(breadcrumb.find('Link').at(1).prop('to')).toBe('/shop/Home')
    expect(breadcrumb.find('[aria-current="page"]').text()).toBe('Test product')
  })

  it('increases quantity without a maximum and never decreases below one', () => {
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={jest.fn()} />)

    for (let count = 0; count < 25; count += 1) wrapper.find('[aria-label="Increase quantity"]').simulate('click')
    expect(wrapper.state('quantity')).toBe(26)
    expect(wrapper.find('.quantityValue').text()).toBe('26')

    for (let count = 0; count < 30; count += 1) wrapper.find('[aria-label="Decrease quantity"]').simulate('click')
    expect(wrapper.state('quantity')).toBe(1)
    expect(wrapper.find('[aria-label="Decrease quantity"]').prop('disabled')).toBe(true)
  })

  it('distinguishes loading, missing, and unavailable products', () => {
    const addToCart = jest.fn()
    expect(shallow(<ProductDetails productsLoaded={false} addToCart={addToCart} />).text()).toContain('Loading product')
    expect(shallow(<ProductDetails productsLoaded addToCart={addToCart} />).text()).toContain('Product not found')

    const wrapper = shallow(<ProductDetails product={{ ...product, inventory: 0 }} productsLoaded addToCart={addToCart} />)
    expect(wrapper.find('.stockStatus').text()).toBe('Temporarily out of stock')
    expect(wrapper.find('.addCartButton').prop('disabled')).toBe(true)
    expect(wrapper.find('.buyNowButton').prop('disabled')).toBe(true)
    expect(wrapper.find('[aria-label="Decrease quantity"]').prop('disabled')).toBe(true)
    expect(wrapper.find('[aria-label="Increase quantity"]').prop('disabled')).toBe(true)
  })

  it('returns to the top when the product page opens or changes products', () => {
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={jest.fn()} />)
    wrapper.instance().componentDidMount()
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)

    window.scrollTo.mockClear()
    wrapper.setState({ quantity: 12, wishedFor: true })
    wrapper.instance().props = { ...wrapper.instance().props, product: { ...product, productId: 8 } }
    wrapper.instance().componentDidUpdate({ product })
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    expect(wrapper.state('quantity')).toBe(1)
    expect(wrapper.state('wishedFor')).toBe(false)
  })

  it('loads persisted comments and saves a new comment through the API', () => {
    const savedComment = { commentId: 4, name: 'Dana', title: 'Lasting review', text: 'Still here', rating: 5, createdAt: '2026-08-09T12:00:00Z', verified: false }
    const loadComments = jest.fn((productId, callback) => callback(null, [savedComment]))
    const createComment = jest.fn((productId, comment, callback) => callback(null, { ...comment, commentId: 5, createdAt: '2026-08-10T12:00:00Z', verified: false }))
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={jest.fn()} loadComments={loadComments} createComment={createComment} />)
    wrapper.instance().componentDidMount()

    expect(loadComments).toHaveBeenCalledWith(7, expect.any(Function))
    expect(wrapper.state('reviews')[0].title).toBe('Lasting review')

    wrapper.setState({ reviewName: ' Taylor ', reviewTitle: ' New comment ', reviewText: ' Persists ', reviewRating: 4 })
    wrapper.instance().submitReview({ preventDefault: jest.fn() })

    expect(createComment).toHaveBeenCalledWith(7, { name: 'Taylor', title: 'New comment', text: 'Persists', rating: 4 }, expect.any(Function))
    expect(wrapper.state('reviews')[0].commentId).toBe(5)
    expect(wrapper.state('reviewName')).toBe('')
  })

  it('does not let a stale comment load overwrite a newly saved comment', () => {
    let loadCallback
    const loadComments = jest.fn((productId, callback) => { loadCallback = callback })
    const createComment = jest.fn((productId, comment, callback) => callback(null, { ...comment, commentId: 9, createdAt: '2026-08-10T12:00:00Z', verified: false }))
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={jest.fn()} loadComments={loadComments} createComment={createComment} />)
    wrapper.instance().componentDidMount()
    wrapper.setState({ reviewName: 'Taylor', reviewTitle: 'Saved', reviewText: 'Database copy', reviewRating: 5 })

    wrapper.instance().submitReview({ preventDefault: jest.fn() })
    loadCallback(null, [])

    expect(wrapper.state('reviews')[0].commentId).toBe(9)
  })

  it('ignores comment responses after navigating to another product', () => {
    let firstProductCallback
    const loadComments = jest.fn((productId, callback) => {
      if (productId === 7) firstProductCallback = callback
    })
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={jest.fn()} loadComments={loadComments} />)
    wrapper.instance().componentDidMount()
    wrapper.instance().props = { ...wrapper.instance().props, product: { ...product, productId: 8 } }
    wrapper.instance().componentDidUpdate({ product })

    firstProductCallback(null, [{ commentId: 3, name: 'Old', title: 'Wrong product', text: 'Stale', rating: 1, createdAt: '2026-08-01T12:00:00Z' }])

    expect(wrapper.state('reviews')[0].title).not.toBe('Wrong product')
  })

  it('persists wishlist changes and ignores an older wishlist load', () => {
    global.localStorage = { getItem: jest.fn(() => 'token'), removeItem: jest.fn() }
    let loadCallback
    const loadWishlist = jest.fn(callback => { loadCallback = callback })
    const addToWishlist = jest.fn((productId, callback) => callback(null, { product }))
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={jest.fn()} loadWishlist={loadWishlist} addToWishlist={addToWishlist} />)
    wrapper.instance().componentDidMount()

    wrapper.find('.wishlistButton').simulate('click')
    loadCallback(null, [])

    expect(addToWishlist).toHaveBeenCalledWith(7, expect.any(Function))
    expect(wrapper.state('wishedFor')).toBe(true)
    expect(wrapper.find('.wishlistButton').text()).toContain('Added to wish list')
  })

  it('removes a saved product from the persistent wishlist', () => {
    global.localStorage = { getItem: jest.fn(() => 'token'), removeItem: jest.fn() }
    const removeFromWishlist = jest.fn((productId, callback) => callback(null))
    const wrapper = shallow(<ProductDetails product={product} productsLoaded addToCart={jest.fn()} removeFromWishlist={removeFromWishlist} />)
    wrapper.setState({ wishedFor: true })

    wrapper.find('.wishlistButton').simulate('click')

    expect(removeFromWishlist).toHaveBeenCalledWith(7, expect.any(Function))
    expect(wrapper.state('wishedFor')).toBe(false)
  })
})
