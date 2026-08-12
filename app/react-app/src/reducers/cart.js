import {
  ADD_TO_CART,
  INCREMENT_CART_ITEM,
  DECREMENT_CART_ITEM,
  REMOVE_FROM_CART,
  SHOW_ADD_TO_CART,
  RESET_ADD_TO_CART,
  CHECKOUT_REQUEST,
  CHECKOUT_FAILURE,
  CREATE_ORDER,
  PURCHASE,
} from '../constants/ActionTypes'

const initialState = {
  addedIds: [],
  quantityById: {},
  itemJustAdded: false,
  lastAddedProductId: null,
}

const addedIds = (state = initialState.addedIds, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      if (state.indexOf(action.productId) !== -1) {
        return state
      }
      return [...state, action.productId]
    default:
      return state
  }
}

const quantityById = (state = initialState.quantityById, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { productId } = action
      return {
        ...state,
        [productId]: (state[productId] || 0) + 1
      }
    default:
      return state
  }
}

export const getQuantity = (state, productId) =>
  state.quantityById[productId] || 0

export const getAddedIds = state => state.addedIds

const cart = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        addedIds: addedIds(state.addedIds, action),
        quantityById: quantityById(state.quantityById, action),
        lastAddedProductId: action.productId,
      }
    case INCREMENT_CART_ITEM: {
      const currentQuantity = getQuantity(state, action.productId)
      if (currentQuantity === 0) return state
      return {
        ...state,
        quantityById: {
          ...state.quantityById,
          [action.productId]: currentQuantity + 1
        }
      }
    }
    case DECREMENT_CART_ITEM: {
      const currentQuantity = getQuantity(state, action.productId)
      if (currentQuantity <= 1) return state
      return {
        ...state,
        quantityById: {
          ...state.quantityById,
          [action.productId]: currentQuantity - 1
        }
      }
    }
    case REMOVE_FROM_CART: {
      if (state.addedIds.indexOf(action.productId) === -1) return state
      const nextQuantityById = { ...state.quantityById }
      delete nextQuantityById[action.productId]
      return {
        ...state,
        addedIds: state.addedIds.filter(productId => productId !== action.productId),
        quantityById: nextQuantityById
      }
    }
    case SHOW_ADD_TO_CART:
      return {
        ...state,
        itemJustAdded: true,
      }
    case RESET_ADD_TO_CART:
      return {
        ...state,
        itemJustAdded: false,
      }
    case `${CREATE_ORDER}_ACK`:
      return initialState
    case `${CREATE_ORDER}_ERR`:
      return state
    case `${PURCHASE}_ACK`:
      return initialState
    case `${PURCHASE}_ERR`:
      return state
    case CHECKOUT_REQUEST:
      return initialState
    case CHECKOUT_FAILURE:
      return action.cart
    default:
      return {
        ...state,
        addedIds: addedIds(state.addedIds, action),
        quantityById: quantityById(state.quantityById, action)
      }
  }
}

export default cart
