/**
 * Mocking client-server processing
 */
import _products from './products.json'
import request from 'superagent'
import { getJwtToken } from '../actions/storage'

const TIMEOUT = 100

export default {
  getProducts: (cb, timeout) => setTimeout(() => cb(_products), timeout || TIMEOUT),
  buyProducts: (payload, cb, timeout) => setTimeout(() => cb(), timeout || TIMEOUT),
  getComments: (productId, cb) => request
    .get(`/api/product/${productId}/comments`)
    .end((error, response) => cb(error, response && response.body)),
  createComment: (productId, comment, cb) => request
    .post(`/api/product/${productId}/comments`)
    .send(comment)
    .end((error, response) => cb(error, response && response.body)),
  getProfile: cb => request
    .get('/api/profile')
    .set('Authorization', `Bearer ${getJwtToken() || ''}`)
    .end((error, response) => cb(error, response && response.body)),
  updateProfile: (profile, cb) => request
    .put('/api/profile')
    .set('Authorization', `Bearer ${getJwtToken() || ''}`)
    .send(profile)
    .end((error, response) => cb(error, response && response.body)),
  getOrders: cb => request
    .get('/api/profile/orders')
    .set('Authorization', `Bearer ${getJwtToken() || ''}`)
    .end((error, response) => cb(error, response && response.body)),
  getWishlist: cb => request
    .get('/api/wishlist')
    .set('Authorization', `Bearer ${getJwtToken() || ''}`)
    .end((error, response) => cb(error, response && response.body)),
  addToWishlist: (productId, cb) => request
    .post(`/api/wishlist/product/${productId}`)
    .set('Authorization', `Bearer ${getJwtToken() || ''}`)
    .end((error, response) => cb(error, response && response.body)),
  removeFromWishlist: (productId, cb) => request
    .del(`/api/wishlist/product/${productId}`)
    .set('Authorization', `Bearer ${getJwtToken() || ''}`)
    .end((error, response) => cb(error, response && response.body))
}
