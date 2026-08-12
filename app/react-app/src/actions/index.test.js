import { addToCart, decrementCartItem, incrementCartItem, removeFromCart } from './index'
import {
  ADD_TO_CART,
  DECREMENT_CART_ITEM,
  INCREMENT_CART_ITEM,
  REMOVE_FROM_CART,
  RESET_ADD_TO_CART,
  SHOW_ADD_TO_CART
} from '../constants/ActionTypes'

describe('add-to-cart confirmation', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('stays visible for 2.5 seconds after the most recent addition', () => {
    const actions = []
    const dispatch = action => {
      if (typeof action === 'function') return action(dispatch, () => ({}))
      actions.push(action)
      return action
    }

    addToCart(1)(dispatch, () => ({}))
    jest.runTimersToTime(2000)
    addToCart(2)(dispatch, () => ({}))
    jest.runTimersToTime(500)

    expect(actions.map(action => action.type)).toEqual([
      ADD_TO_CART,
      SHOW_ADD_TO_CART,
      ADD_TO_CART,
      SHOW_ADD_TO_CART,
    ])

    jest.runTimersToTime(1999)
    expect(actions.some(action => action.type === RESET_ADD_TO_CART)).toBe(false)

    jest.runTimersToTime(1)
    expect(actions[actions.length - 1].type).toBe(RESET_ADD_TO_CART)
  })
})

describe('order-summary actions', () => {
  it('creates actions for each cart editing control', () => {
    expect(incrementCartItem(4)).toEqual({ type: INCREMENT_CART_ITEM, productId: 4 })
    expect(decrementCartItem(4)).toEqual({ type: DECREMENT_CART_ITEM, productId: 4 })
    expect(removeFromCart(4)).toEqual({ type: REMOVE_FROM_CART, productId: 4 })
  })
})
