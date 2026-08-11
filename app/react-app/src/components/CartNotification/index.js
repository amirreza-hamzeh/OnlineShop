import React, { PropTypes } from 'react'
import { VelocityComponent } from 'velocity-react'
import imageUrl from '../../utils/imageUrl'
import './styles.css'

const CartNotification = ({ showItemAdded, product, totalProducts }) => {
  const child = (
    <div className="cartNotification" role="status" aria-live="polite" aria-atomic="true" aria-hidden={!showItemAdded}>
      <span className="cartNotificationCheck" aria-hidden="true">&#10003;</span>
      {product && product.image
        ? <img className="cartNotificationImage" src={imageUrl(product.image)} alt="" />
        : null}
      <div className="cartNotificationCopy">
        <strong>Added to cart</strong>
        {product ? <span className="cartNotificationName">{product.name}</span> : null}
        <span className="cartNotificationTotal">{totalProducts} {totalProducts === 1 ? 'item' : 'items'} in your cart</span>
      </div>
    </div>
  )
  return (
    <VelocityComponent
      animation={{ opacity: showItemAdded ? 1 : 0, translateY: showItemAdded ? '0px' : '18px' }}
      duration={300}
    >
      {child}
    </VelocityComponent>
  )
}

CartNotification.propTypes = {
  showItemAdded: PropTypes.bool.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
  totalProducts: PropTypes.number,
}

CartNotification.defaultProps = {
  showItemAdded: false,
  product: null,
  totalProducts: 0,
}

export default CartNotification
