import cart from './cart'
import { ADD_TO_CART, RESET_ADD_TO_CART, SHOW_ADD_TO_CART } from '../constants/ActionTypes'

describe('cart feedback', () => {
  it('remembers which product was most recently added', () => {
    const firstState = cart(undefined, { type: ADD_TO_CART, productId: 7 })
    const visibleState = cart(firstState, { type: SHOW_ADD_TO_CART })

    expect(visibleState.lastAddedProductId).toBe(7)
    expect(visibleState.quantityById[7]).toBe(1)
    expect(visibleState.itemJustAdded).toBe(true)

    const hiddenState = cart(visibleState, { type: RESET_ADD_TO_CART })
    expect(hiddenState.itemJustAdded).toBe(false)
    expect(hiddenState.lastAddedProductId).toBe(7)
  })
})
