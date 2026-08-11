import { addToCart } from './index'
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
