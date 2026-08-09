import React from 'react'
import { shallow } from 'enzyme'
import Footer from './index'

describe('shopping trust section', () => {
  it('provides credibility answers at the home page anchor target', () => {
    const wrapper = shallow(<Footer />)

    expect(wrapper.find('#trust-and-safety').length).toBe(1)
    expect(wrapper.find('.trustAnswer').length).toBe(4)
    expect(wrapper.find('#trust-title').text()).toBe('Questions about shopping with us?')
  })
})
