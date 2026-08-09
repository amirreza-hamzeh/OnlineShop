import React from 'react'
import { shallow } from 'enzyme'
import Header from './index'
import Footer from '../Footer'

describe('home page hero', () => {
  it('links the Why shop with us action to the trust questions', () => {
    const header = shallow(<Header />)
    const footer = shallow(<Footer />)
    const trustLink = header.find('.secondaryHeroButton')

    expect(trustLink.prop('href')).toBe('#trust-and-safety')
    expect(footer.find(trustLink.prop('href')).length).toBe(1)
  })
})
