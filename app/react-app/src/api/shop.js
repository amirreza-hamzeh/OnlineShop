/**
 * Mocking client-server processing
 */
import _products from './products.json'
import request from 'superagent'

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
    .end((error, response) => cb(error, response && response.body))
}
