import React from 'react'
import { shallow } from 'enzyme'
import FlatButton from 'material-ui/FlatButton'
import GridTile from './index'

const tileProps = {
  productId: 4,
  name: 'Canvas Tote',
  price: '$34.00',
  inventory: 0,
  onAddToCartClicked: jest.fn(),
}

describe('catalog add button', () => {
  beforeEach(() => tileProps.onAddToCartClicked.mockClear())

  it('does not add an out-of-stock product to the cart', () => {
    const wrapper = shallow(<GridTile {...tileProps} />)
    const addButton = wrapper.find(FlatButton)

    expect(addButton.prop('disabled')).toBe(true)
    expect(addButton.prop('label')).toBe('Out of stock')
    wrapper.instance().addToCart()
    expect(tileProps.onAddToCartClicked).not.toHaveBeenCalled()
  })

  it('adds an available product', () => {
    const onAddToCartClicked = jest.fn()
    const wrapper = shallow(
      <GridTile {...tileProps} inventory={2} onAddToCartClicked={onAddToCartClicked} />
    )

    wrapper.instance().addToCart()
    expect(onAddToCartClicked).toHaveBeenCalledWith(4)
  })
})
