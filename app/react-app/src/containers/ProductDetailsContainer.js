import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { addToCart } from '../actions'
import { getProduct } from '../reducers/products'
import ProductDetails from '../components/ProductDetails'
import shop from '../api/shop'

const ProductDetailsContainer = ({ product, productsLoaded, addToCart }) => (
  <ProductDetails product={product} productsLoaded={productsLoaded} addToCart={addToCart} loadComments={shop.getComments} createComment={shop.createComment} />
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
