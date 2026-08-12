import cart from './cart'
import {
  ADD_TO_CART,
  INCREMENT_CART_ITEM,
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
  it('increments and decrements an existing item without going below one', () => {
    const oneItem = cart(undefined, { type: ADD_TO_CART, productId: 7 })
    const twoItems = cart(oneItem, { type: INCREMENT_CART_ITEM, productId: 7 })
    const decremented = cart(twoItems, { type: DECREMENT_CART_ITEM, productId: 7 })

    expect(decremented.quantityById[7]).toBe(1)
    expect(cart(decremented, { type: DECREMENT_CART_ITEM, productId: 7 })).toBe(decremented)
  })

  it('does not add a missing product when an order-summary control is stale', () => {
    const state = cart(undefined, { type: INCREMENT_CART_ITEM, productId: 7 })

    expect(state).toEqual(expect.objectContaining({ addedIds: [], quantityById: {} }))
  })

  it('removes an item and its quantity from the cart', () => {
    let state = cart(undefined, { type: ADD_TO_CART, productId: 7 })
    state = cart(state, { type: ADD_TO_CART, productId: 8 })
    const removed = cart(state, { type: REMOVE_FROM_CART, productId: 7 })

    expect(removed.addedIds).toEqual([8])
    expect(removed.quantityById).toEqual({ 8: 1 })
  })
})
