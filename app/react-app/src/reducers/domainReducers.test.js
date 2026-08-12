import container from './container'
import customer, { isActive } from './customer'
import products, { getProduct, getVisibleProducts } from './products'
import {
  ADD_USER,
  CREATE_CUSTOMER,
  LOGIN_CUSTOMER,
  LOGOUT_CUSTOMER,
  FETCH_CONTAINER_ID,
  ITEMS_REQUEST,
  DUMMY_ITEMS_REQUEST,
} from '../constants/ActionTypes'

describe('domain reducers', () => {
  it('tracks the complete customer authentication lifecycle', () => {
    let state = customer(undefined, { type: '@@init' })
    state = customer(state, { type: ADD_USER, username: 'arthur@example.com' })
    expect(state.username).toBe('arthur@example.com')

    state = customer(state, { type: `${CREATE_CUSTOMER}_ACK`, payload: { customerId: 42 } })
    expect(isActive(state)).toBe(true)
    state = customer(state, { type: `${LOGIN_CUSTOMER}_ACK`, payload: { customerId: 42, name: 'Arthur' } })
    expect(state.details.name).toBe('Arthur')
    state = customer(state, { type: LOGOUT_CUSTOMER })
    expect(isActive(state)).toBe(false)
    expect(state.details).toEqual({})

    expect(customer({ customerId: 42 }, { type: `${LOGIN_CUSTOMER}_ERR` }).customerId).toBe('')
    expect(customer({ customerId: 42 }, { type: `${CREATE_CUSTOMER}_ERR` }).customerId).toBe('')
  })

  it('indexes server and fallback catalog products in visible order', () => {
    const payload = [
      { productId: 8, name: 'Towel' },
      { productId: 3, name: 'Tea' },
    ]
    let state = products(undefined, { type: `${ITEMS_REQUEST}_ACK`, payload })
    expect(getProduct(state, 8).name).toBe('Towel')
    expect(getVisibleProducts(state).map(item => item.productId)).toEqual([8, 3])

    state = products(undefined, { type: DUMMY_ITEMS_REQUEST, products: payload.slice().reverse() })
    expect(getVisibleProducts(state).map(item => item.productId)).toEqual([3, 8])
  })

  it('updates container identity and keeps the fallback address on errors', () => {
    let state = container(undefined, {
      type: `${FETCH_CONTAINER_ID}_ACK`,
      payload: { ip: '192.0.2.4', host: 'shop-1' },
    })
    expect(state).toEqual({ ip: '192.0.2.4', host: 'shop-1' })
    state = container(state, { type: `${FETCH_CONTAINER_ID}_ERR` })
    expect(state.ip).toBe('10.0.2.3')
    expect(state.host).toBe('shop-1')
  })
})
