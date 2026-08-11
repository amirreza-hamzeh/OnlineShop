import React, { Component, PropTypes } from 'react'
import imageUrl from '../../utils/imageUrl'
import './styles.css'

class Product extends Component {
  render() {
    const { price, quantity, inventory, name, image, onIncrement, onDecrement, onRemove } = this.props;
    const atInventoryLimit = typeof inventory === 'number' && quantity >= inventory
    const image2 = (
      <img
        alt={name}
        src={imageUrl(image)}
        height="60px"
        width="60px"
      />
    );
    return (
      <div className='productItem'>
        <div className='columnLeft'>
          {image2}
        </div>
        <div className='columnCenter'>
          <div>{name}</div>
          <div className="quantityEditor" aria-label={`Quantity for ${name}`}>
            <button type="button" onClick={onDecrement} disabled={quantity <= 1} aria-label={`Decrease ${name} quantity`}>−</button>
            <span aria-live="polite">{quantity}</span>
            <button type="button" onClick={onIncrement} disabled={atInventoryLimit} aria-label={`Increase ${name} quantity`}>+</button>
          </div>
          {atInventoryLimit && <small className="inventoryLimit" role="status">Maximum available</small>}
        </div>
        <div className='columnRight'>
          <strong>{`$${(Number(price) * quantity).toFixed(2)}`}</strong>
          <button type="button" className="removeProduct" onClick={onRemove} aria-label={`Remove ${name} from order`}>Remove</button>
        </div>
      </div>
    );
  }
}


Product.propTypes = {
  price: PropTypes.number,
  quantity: PropTypes.number,
  inventory: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default Product
