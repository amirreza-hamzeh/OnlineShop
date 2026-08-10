jest.mock('react-router', () => ({
  hashHistory: { replace: jest.fn() },
  Link: props => <a>{props.children}</a>,
}))
jest.mock('../api/shop', () => ({
  getWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
}))

import React from 'react'
import { shallow } from 'enzyme'
import { hashHistory } from 'react-router'
import shop from '../api/shop'
import ProfileContainer from './ProfileContainer'

const item = {
  wishlistItemId: 4,
  product: { productId: 1, name: 'Everyday Canvas Tote', price: 34, image: '/images/1.png' }
}

describe('wishlist profile', () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: jest.fn(() => 'token'),
      removeItem: jest.fn(),
    }
    hashHistory.replace.mockClear()
    shop.getWishlist.mockReset()
    shop.removeFromWishlist.mockReset()
  })

  it('loads persisted products and removes them from the profile', () => {
    shop.getWishlist.mockImplementation(callback => callback(null, [item]))
    shop.removeFromWishlist.mockImplementation((productId, callback) => callback(null))
    const wrapper = shallow(<ProfileContainer location={{ pathname: '/profile' }} />)
    wrapper.instance().componentDidMount()

    expect(wrapper.find('.wishlistCard h3 Link').prop('children')).toBe('Everyday Canvas Tote')
    wrapper.find('.wishlistCard button').simulate('click')
    expect(shop.removeFromWishlist).toHaveBeenCalledWith(1, expect.any(Function))
    expect(wrapper.find('.profileEmpty').length).toBe(1)
  })

  it('clears an expired token and returns to sign in', () => {
    shop.getWishlist.mockImplementation(callback => callback({ status: 401 }))
    const wrapper = shallow(<ProfileContainer location={{ pathname: '/profile' }} />)
    wrapper.instance().componentDidMount()

    expect(localStorage.removeItem).toHaveBeenCalledWith('jwtToken')
    expect(hashHistory.replace).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/sign-in' }))
  })
})
