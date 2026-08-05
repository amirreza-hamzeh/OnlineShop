import React, { Component, PropTypes } from 'react'
import FlatButton from 'material-ui/FlatButton'
import AddIcon from './AddIcon'
import './styles.css'

const formatRating = rating => rating ? rating.toFixed(1) : 'New'

export default class GridTile extends Component {
  addToCart = () => {
    const { onAddToCartClicked, productId } = this.props
    onAddToCartClicked(productId)
  }

  renderBadges() {
    const { isNew, discountPercent, inventory } = this.props
    return (
      <div className="tileBadges">
        {isNew ? <span className="tileBadge tileBadgeNew">New</span> : null}
        {discountPercent ? <span className="tileBadge tileBadgeSale">{discountPercent}% off</span> : null}
        {inventory <= 10 ? <span className="tileBadge tileBadgeStock">Low stock</span> : null}
      </div>
    )
  }

  render() {
    const {
      price,
      originalPrice,
      name,
      brand,
      category,
      description,
      image,
      rating,
      reviewCount,
    } = this.props

    return (
      <article className="tile">
        <div className="tileImage">
          {this.renderBadges()}
          <img alt={name} src={process.env.PUBLIC_URL + image} />
        </div>
        <div className="tileContent">
          <div className="tileMeta">{brand} · {category}</div>
          <h3 className="tileTitle">{name}</h3>
          <p className="tileDescription">{description}</p>
          <div className="tileRating" aria-label={`${formatRating(rating)} out of 5 stars`}>
            <span className="tileStars">★★★★★</span>
            <span>{formatRating(rating)} ({reviewCount || 0})</span>
          </div>
          <div className="titleBottom">
            <div className="tilePriceGroup">
              <span className="tilePrice">{price}</span>
              {originalPrice && originalPrice !== price ? <span className="tileOriginalPrice">{originalPrice}</span> : null}
            </div>
            <div className="tileAdd">
              <FlatButton
                onClick={this.addToCart}
                labelStyle={{ color: '#0f766e', fontWeight: 700 }}
                label="Add"
                labelPosition="before"
                icon={<AddIcon />}
              />
            </div>
          </div>
        </div>
      </article>
    )
  }
}

GridTile.propTypes = {
  productId: PropTypes.number,
  price: PropTypes.string,
  originalPrice: PropTypes.string,
  name: PropTypes.string,
  brand: PropTypes.string,
  category: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  rating: PropTypes.number,
  reviewCount: PropTypes.number,
  inventory: PropTypes.number,
  isNew: PropTypes.bool,
  discountPercent: PropTypes.number,
  onAddToCartClicked: PropTypes.func.isRequired
}
