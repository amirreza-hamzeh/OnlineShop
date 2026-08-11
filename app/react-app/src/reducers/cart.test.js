import cart from './cart'
import {
  ADD_TO_CART,
  DECREMENT_CART_ITEM,
  REMOVE_FROM_CART,
  RESET_ADD_TO_CART,
  SHOW_ADD_TO_CART
} from '../constants/ActionTypes'

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

describe('cart editing', () => {
  it('increments and decrements an item without allowing a zero quantity', () => {
    const oneItem = cart(undefined, { type: ADD_TO_CART, productId: 7 })
    const twoItems = cart(oneItem, { type: ADD_TO_CART, productId: 7 })
    const decremented = cart(twoItems, { type: DECREMENT_CART_ITEM, productId: 7 })

    expect(decremented.quantityById[7]).toBe(1)
    expect(cart(decremented, { type: DECREMENT_CART_ITEM, productId: 7 })).toBe(decremented)
  })

  it('removes an item and its stored quantity', () => {
    const state = cart(undefined, { type: ADD_TO_CART, productId: 7 })
    const removed = cart(state, { type: REMOVE_FROM_CART, productId: 7 })

    expect(removed.addedIds).toEqual([])
    expect(removed.quantityById[7]).toBeUndefined()
  })
})
