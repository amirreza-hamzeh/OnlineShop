jest.mock('react-router', () => ({
  hashHistory: { push: jest.fn() }
}))

import React from 'react'
import { shallow } from 'enzyme'
import ProductsList from './index'
import { hashHistory } from 'react-router'

const products = [
  { productId: 1, name: 'Canvas Tote', price: 34, category: 'Accessories' },
  { productId: 2, name: 'Travel Charger', price: 49, category: 'Tech' },
  { productId: 3, name: 'Tech Organizer', price: 29, category: 'Tech' }
]

describe('category menu', () => {
  beforeEach(() => hashHistory.push.mockClear())

  it('opens from the hamburger button and filters products by category', () => {
    const wrapper = shallow(<ProductsList products={products} addToCart={jest.fn()} />)

    wrapper.find('.categoryMenuButton').simulate('click')
    expect(wrapper.find('.categoryMenuList').length).toBe(1)
    expect(wrapper.find('.categoryMenuItem').map(item => item.text())).toEqual([
      'All3',
      'Accessories1',
      'Tech2'
    ])

    wrapper.setState({ query: 'charger' })
    wrapper.find('.categoryMenuItem').at(2).simulate('click')
    expect(wrapper.state('category')).toBe('Tech')
    expect(wrapper.state('isCategoryMenuOpen')).toBe(false)
    expect(wrapper.state('query')).toBe('')
    expect(wrapper.find('.productListWrapper').children().length).toBe(2)
    expect(hashHistory.push).toHaveBeenCalledWith('/shop/Tech')
  })

  it('starts with the category in the path and can navigate back to the full shop', () => {
    const wrapper = shallow(<ProductsList products={products} category="Accessories" addToCart={jest.fn()} />)

    expect(wrapper.state('category')).toBe('Accessories')
    expect(wrapper.find('.productListWrapper').children().length).toBe(1)
    wrapper.instance().selectCategory('All')
    expect(hashHistory.push).toHaveBeenCalledWith('/')
  })

  it('closes an open category menu with Escape', () => {
    const wrapper = shallow(<ProductsList products={products} addToCart={jest.fn()} />)
    const focus = jest.fn()
    wrapper.instance().categoryMenuButton = { focus }
    wrapper.setState({ isCategoryMenuOpen: true })

    wrapper.instance().handleKeyDown({ key: 'Escape' })

    expect(wrapper.state('isCategoryMenuOpen')).toBe(false)
    expect(focus).toHaveBeenCalled()
  })

  it('closes the category menu when the shopper clicks elsewhere', () => {
    const wrapper = shallow(<ProductsList products={products} addToCart={jest.fn()} />)
    wrapper.instance().categoryMenu = { contains: () => false }
    wrapper.setState({ isCategoryMenuOpen: true })

    wrapper.instance().handleDocumentClick({ target: {} })

    expect(wrapper.state('isCategoryMenuOpen')).toBe(false)
  })
})
