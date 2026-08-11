import React, { PropTypes } from 'react'
import CartIcon from '../../components/CartIcon'
import './styles.css'

const Cart = ({ total }) => {
  return (
    <div className="checkoutSection">
      <div className="cartRow">
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
}

export default Cart
