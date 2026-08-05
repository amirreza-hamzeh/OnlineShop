import React, { PropTypes } from 'react'
import GridTile from '../../components/GridTile'

const formatPrice = price => `$${Number(price).toFixed(2)}`

const ProductItem = ({ product, onAddToCartClicked }) => (
  <GridTile
    productId={product.productId}
    name={product.name}
    brand={product.brand}
    category={product.category}
    description={product.description}
    price={formatPrice(product.price)}
    originalPrice={product.originalPrice ? formatPrice(product.originalPrice) : null}
    image={product.image}
    rating={product.rating}
    reviewCount={product.reviewCount}
    inventory={product.inventory}
    isNew={product.isNew}
    discountPercent={product.discountPercent}
    onAddToCartClicked={onAddToCartClicked}
  />
)

ProductItem.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    inventory: PropTypes.number,
    isNew: PropTypes.bool,
    discountPercent: PropTypes.number
  }).isRequired,
  onAddToCartClicked: PropTypes.func.isRequired
}

export default ProductItem
