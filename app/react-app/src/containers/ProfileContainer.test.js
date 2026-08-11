jest.mock('react-router', () => ({
  hashHistory: { replace: jest.fn() },
  Link: props => <a>{props.children}</a>,
}))
jest.mock('../api/shop', () => ({
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
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
    shop.getProfile.mockReset()
    shop.updateProfile.mockReset()
    shop.getProfile.mockImplementation(callback => callback(null, {
      firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com', phone: '555-0100',
      streetAddress: '123 Market Street', city: 'Seattle', region: 'WA', postalCode: '98101', country: 'United States'
    }))
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

  it('shows account details and saves edits', () => {
    shop.getWishlist.mockImplementation(callback => callback(null, []))
    shop.updateProfile.mockImplementation((profile, callback) => callback(null, profile))
    const wrapper = shallow(<ProfileContainer location={{ pathname: '/profile' }} />)
    wrapper.instance().componentDidMount()

    expect(wrapper.find('.profileSummary').text()).toContain('Alex Morgan')
    wrapper.find('.accountPanelHeading > button').simulate('click')
    wrapper.find('input[name="phone"]').simulate('change', { target: { name: 'phone', value: '555-0200' } })
    wrapper.find('.profileForm').simulate('submit', { preventDefault: jest.fn() })

    expect(shop.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'Alex', lastName: 'Morgan', phone: '555-0200', streetAddress: '123 Market Street',
      city: 'Seattle', region: 'WA', postalCode: '98101', country: 'United States'
    }), expect.any(Function))
    expect(wrapper.find('.profileSaved').length).toBe(1)
  })
})
