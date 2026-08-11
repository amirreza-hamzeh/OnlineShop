import React, { PropTypes } from 'react'
import { VelocityComponent } from 'velocity-react'
import imageUrl from '../../utils/imageUrl'
import './styles.css'

const CartNotification = ({ showItemAdded, product }) => {
  const child = (
    <div className="cartNotification" role="status" aria-live="polite" aria-hidden={!showItemAdded}>
      {product && product.image
        ? <img className="cartNotificationImage" src={imageUrl(product.image)} alt="" />
        : null}
      <div className="cartNotificationCopy">
        <strong>Added to your cart</strong>
        {product ? <span>{product.name}</span> : null}
      </div>
    </div>
  )
  return (
    <VelocityComponent
      animation={{ opacity: showItemAdded ? 1 : 0 }}
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
}

CartNotification.defaultProps = {
  showItemAdded: false,
  product: null,
}

export default CartNotification
