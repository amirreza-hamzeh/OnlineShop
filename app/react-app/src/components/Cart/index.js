import React, { PropTypes } from 'react'
import CartIcon from '../../components/CartIcon'
import CartNotification from '../../components/CartNotification'
import './styles.css'

const Cart = ({ total, showItemAdded, lastAddedProduct }) => {
  return (
    <div className="checkoutSection">
      <div className="cartRow">
        <div className="checkoutMessage">
          <CartNotification showItemAdded={showItemAdded} product={lastAddedProduct} />
        </div>
        <div className="cartQuantity">
          <CartIcon />
          <div className="cartDigit">
            {total}
          </div>
        </div>
      </div>
    </div>
  )
}

Cart.propTypes = {
  total: PropTypes.number,
  showItemAdded: PropTypes.bool,
  lastAddedProduct: PropTypes.object,
}

export default Cart
