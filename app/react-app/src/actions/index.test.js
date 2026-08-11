import { addToCart, incrementCartItem } from './index'
import { ADD_TO_CART, RESET_ADD_TO_CART, SHOW_ADD_TO_CART } from '../constants/ActionTypes'

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

describe('checkout quantity changes', () => {
  it('increments when inventory is available', () => {
    const dispatch = jest.fn()
    const getState = () => ({
      cart: { quantityById: { 1: 2 } },
      products: { byId: { 1: { productId: 1, inventory: 3 } } }
    })

    incrementCartItem(1)(dispatch, getState)

    expect(dispatch).toHaveBeenCalledWith({ type: ADD_TO_CART, productId: 1 })
  })

  it('does not increment beyond available inventory', () => {
    const dispatch = jest.fn()
    const getState = () => ({
      cart: { quantityById: { 1: 3 } },
      products: { byId: { 1: { productId: 1, inventory: 3 } } }
    })

    incrementCartItem(1)(dispatch, getState)

    expect(dispatch).not.toHaveBeenCalled()
  })
})
