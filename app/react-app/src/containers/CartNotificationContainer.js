import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import CartNotification from '../components/CartNotification'
import { getLastAddedProduct, getTotalProducts, itemJustAddedSelector } from '../reducers'

export const CartNotificationContainer = ({ product, show, totalProducts }) => (
  <CartNotification
    product={product}
    showItemAdded={show}
    totalProducts={totalProducts}
  />
)

CartNotificationContainer.propTypes = {
  product: PropTypes.object,
  show: PropTypes.bool,
  totalProducts: PropTypes.number,
}

const mapStateToProps = state => ({
  product: getLastAddedProduct(state),
  show: itemJustAddedSelector(state),
  totalProducts: getTotalProducts(state),
})

export default connect(mapStateToProps)(CartNotificationContainer)
