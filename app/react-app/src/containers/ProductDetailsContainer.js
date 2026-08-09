import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { addToCart } from '../actions'
import { getProduct } from '../reducers/products'
import ProductDetails from '../components/ProductDetails'

const ProductDetailsContainer = ({ product, productsLoaded, addToCart }) => (
  <ProductDetails product={product} productsLoaded={productsLoaded} addToCart={addToCart} />
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
