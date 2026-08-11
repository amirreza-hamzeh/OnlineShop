import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router'
import SuccessMessage from './index'

describe('order success message', () => {
  it('shows a complete checkout journey and next steps', () => {
    const wrapper = shallow(<SuccessMessage message="Your order is placed." label="Continue shopping" />)

    expect(wrapper.find('#success-title').text()).toBe('Thank you for your order!')
    expect(wrapper.find('.successMessage').text()).toBe('Your order is placed.')
    expect(wrapper.find('.journeyItem')).toHaveLength(3)
    expect(wrapper.find('.successSteps .active').text()).toContain('Confirmation')
    expect(wrapper.text()).not.toContain('email')
    expect(wrapper.text()).not.toContain('Tracking to follow')
    expect(wrapper.find('i[aria-hidden="true"]')).toHaveLength(4)
  })

  it('provides clear routes back to shopping and to the customer profile', () => {
    const wrapper = shallow(<SuccessMessage message="Done." label="Continue shopping" />)
    const links = wrapper.find(Link)

    expect(links.filterWhere(link => link.prop('to') === '/')).toHaveLength(2)
    expect(links.filterWhere(link => link.prop('to') === '/profile')).toHaveLength(1)
  })
})
