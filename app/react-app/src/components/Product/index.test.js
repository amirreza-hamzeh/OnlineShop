import React from 'react'
import { shallow } from 'enzyme'
import Product from './index'

const productProps = {
  price: 25,
  quantity: 2,
  inventory: 4,
  name: 'Watch',
  image: 'watch.png',
  onIncrement: jest.fn(),
  onDecrement: jest.fn(),
  onRemove: jest.fn()
}

describe('checkout product editor', () => {
  beforeEach(() => {
    productProps.onIncrement.mockClear()
    productProps.onDecrement.mockClear()
    productProps.onRemove.mockClear()
  })

  it('updates quantity and removes the item through its controls', () => {
    const wrapper = shallow(<Product {...productProps} />)
    const buttons = wrapper.find('.quantityEditor button')

    buttons.at(0).simulate('click')
    buttons.at(1).simulate('click')
    wrapper.find('.removeProduct').simulate('click')

    expect(productProps.onDecrement).toHaveBeenCalledTimes(1)
    expect(productProps.onIncrement).toHaveBeenCalledTimes(1)
    expect(productProps.onRemove).toHaveBeenCalledTimes(1)
  })

  it('prevents decrementing below one', () => {
    const wrapper = shallow(<Product {...productProps} quantity={1} />)

    expect(wrapper.find('.quantityEditor button').at(0).prop('disabled')).toBe(true)
  })

  it('prevents ordering more products than are available', () => {
    const wrapper = shallow(<Product {...productProps} quantity={4} />)

    expect(wrapper.find('.quantityEditor button').at(1).prop('disabled')).toBe(true)
    expect(wrapper.find('.inventoryLimit').text()).toBe('Maximum available')
  })
})
