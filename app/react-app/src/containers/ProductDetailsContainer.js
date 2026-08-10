import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { addToCart } from '../actions'
import { getProduct } from '../reducers/products'
import ProductDetails from '../components/ProductDetails'
import shop from '../api/shop'

const ProductDetailsContainer = ({ product, productsLoaded, addToCart, location }) => (
  <ProductDetails product={product} productsLoaded={productsLoaded} addToCart={addToCart} location={location} loadComments={shop.getComments} createComment={shop.createComment} loadWishlist={shop.getWishlist} addToWishlist={shop.addToWishlist} removeFromWishlist={shop.removeFromWishlist} />
)

ProductDetailsContainer.propTypes = {
  product: PropTypes.object,
  productsLoaded: PropTypes.bool.isRequired,
  addToCart: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  product: getProduct(state.products, Number(ownProps.params.productId)),
  productsLoaded: state.products.visibleIds.length > 0
})

export default connect(mapStateToProps, { addToCart })(ProductDetailsContainer)
