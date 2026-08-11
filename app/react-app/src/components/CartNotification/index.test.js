import React from 'react'
import { shallow } from 'enzyme'
import CartNotification from './index'

describe('cart notification', () => {
  it('shows the added product name and image', () => {
    const wrapper = shallow(
      <CartNotification showItemAdded totalProducts={3} product={{ name: 'Canvas Tote', image: '/images/1.png' }} />
    )
    const notification = wrapper.find('.cartNotification')

    expect(notification.prop('aria-hidden')).toBe(false)
    expect(notification.text()).toContain('Canvas Tote')
    expect(notification.text()).toContain('3 items in your cart')
    expect(wrapper.find('.cartNotificationImage').prop('src')).toContain('/images/1.png')
  })
})
