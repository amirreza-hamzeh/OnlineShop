import React, { Component, PropTypes } from 'react'
import { Link, hashHistory } from 'react-router'
import TopNav from '../TopNav'
import Footer from '../Footer'
import imageUrl from '../../utils/imageUrl'
import { categoryPath } from '../../utils/catalogPath'
import './styles.css'

const comments = [
  { name: 'Maya R.', rating: 5, title: 'Exactly what I hoped for', text: 'Beautiful quality, thoughtfully packed, and even better in person. It has quickly become part of my everyday routine.', date: 'July 18, 2026', verified: true },
  { name: 'Jordan T.', rating: 4, title: 'Great quality and value', text: 'The details feel premium and it arrived right on time. I would happily recommend it to a friend.', date: 'June 29, 2026', verified: true },
  { name: 'Sam K.', rating: 5, title: 'A really useful find', text: 'Simple, well made, and true to the description. The photos represent the product accurately.', date: 'May 12, 2026', verified: false }
]

export const numericPrice = price => {
  const parsedPrice = Number(price)
  return isNaN(parsedPrice) ? 0 : parsedPrice
}

export const formatPrice = price => `$${numericPrice(price).toFixed(2)}`

export const getDeliveryDate = (fromDate = new Date()) => {
  const deliveryDate = new Date(fromDate.getTime())
  deliveryDate.setDate(deliveryDate.getDate() + 3)
  return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export const scrollPageToTop = () => {
  if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo(0, 0)
}

export default class ProductDetails extends Component {
  state = {
    quantity: 1,
    wishedFor: false,
    reviews: comments,
    reviewSort: 'recent',
    showReviewForm: false,
    reviewName: '',
    reviewTitle: '',
    reviewText: '',
    reviewRating: 5,
    helpfulReviews: {}
  }

  componentDidMount() {
    scrollPageToTop()
  }

  componentDidUpdate(previousProps) {
    const previousId = previousProps.product && previousProps.product.productId
    const currentId = this.props.product && this.props.product.productId
    if (currentId && currentId !== previousId) {
      scrollPageToTop()
      this.setState({ quantity: 1, wishedFor: false, reviews: comments, helpfulReviews: {} })
    }
  }

  addQuantityToCart = () => {
    for (let count = 0; count < this.state.quantity; count += 1) {
      this.props.addToCart(this.props.product.productId)
    }
  }

  decreaseQuantity = () => {
    this.setState(previousState => ({ quantity: Math.max(1, previousState.quantity - 1) }))
  }

  increaseQuantity = () => {
    this.setState(previousState => ({ quantity: previousState.quantity + 1 }))
  }

  buyNow = () => {
    this.addQuantityToCart()
    hashHistory.push('/checkout')
  }

  scrollToReviews = () => {
    const reviews = document.getElementById('reviews')
    if (reviews) reviews.scrollIntoView({ behavior: 'smooth' })
  }

  submitReview = event => {
    event.preventDefault()
    const { reviewName, reviewTitle, reviewText, reviewRating } = this.state
    if (!reviewName.trim() || !reviewTitle.trim() || !reviewText.trim()) return
    this.setState({
      reviews: [{ name: reviewName.trim(), title: reviewTitle.trim(), text: reviewText.trim(), rating: reviewRating, date: 'Today', verified: false }].concat(this.state.reviews),
      reviewName: '',
      reviewTitle: '',
      reviewText: '',
      reviewRating: 5,
      reviewSort: 'recent',
      showReviewForm: false
    })
  }

  getSortedReviews() {
    const reviews = this.state.reviews.slice()
    if (this.state.reviewSort === 'rated') reviews.sort((first, second) => second.rating - first.rating)
    return reviews
  }

  render() {
    const { product } = this.props
    if (!product && !this.props.productsLoaded) {
      return <div><TopNav /><main className="detailNotFound" aria-live="polite"><h1>Loading product…</h1></main></div>
    }
    if (!product) {
      return <div><TopNav /><main className="detailNotFound"><h1>Product not found</h1><Link to="/">Return to the shop</Link></main></div>
    }
    const price = numericPrice(product.price)
    const originalPrice = numericPrice(product.originalPrice)
    const savings = originalPrice > price ? originalPrice - price : 0
    const deliveryDate = getDeliveryDate()
    const inventory = Number(product.inventory) || 0
    const previousPath = categoryPath(product.category)

    return (
      <div className="productDetailPage">
        <TopNav />
        <main className="detailShell">
          <nav className="detailBreadcrumb" aria-label="Breadcrumb">
            <Link to="/">Shop</Link>
            <span aria-hidden="true">/</span>
            <Link to={previousPath}>{product.category}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>
          <section className="detailHero">
            <div className="detailGallery">
              <div className="detailThumb active"><img src={imageUrl(product.image)} alt="" /></div>
              <div className="detailMainImage"><img src={imageUrl(product.image)} alt={product.name} /></div>
            </div>
            <div className="detailInfo">
              <span className="detailBrand">{product.brand}</span>
              <h1>{product.name}</h1>
              <button className="detailRating" type="button" onClick={this.scrollToReviews}><span>★★★★★</span> {product.rating || 'New'} · {product.reviewCount || 0} ratings</button>
              <p className="detailDescription">{product.description}</p>
              <hr />
              <div className="detailPrice"><span>{formatPrice(price)}</span>{originalPrice > price ? <del>{formatPrice(originalPrice)}</del> : null}</div>
              {savings ? <p className="detailSavings">You save ${savings.toFixed(2)} ({product.discountPercent}%)</p> : null}
              <p className="detailTax">Price includes applicable taxes. Free returns within 30 days.</p>
              <div className="detailHighlights">
                <div><b>✓</b><span><strong>Curated quality</strong>Inspected before shipping</span></div>
                <div><b>↩</b><span><strong>Easy returns</strong>30-day return window</span></div>
                <div><b>♢</b><span><strong>Secure payment</strong>Your data is protected</span></div>
              </div>
              <h2>About this item</h2>
              <ul>{(product.tags || []).map(tag => <li key={tag}>Designed for {tag}</li>)}<li>Backed by our satisfaction guarantee</li></ul>
            </div>
            <aside className="detailBuyBox">
              <div className="buyPrice">{formatPrice(price)}</div>
              <p><strong>FREE delivery</strong> <b>{deliveryDate}</b></p>
              <p className="deliveryLocation">⌖ Delivering to your saved address</p>
              <div className={inventory ? 'stockStatus' : 'stockStatus outOfStock'}>{inventory > 10 ? 'In stock' : inventory > 0 ? `Only ${inventory} left in stock` : 'Temporarily out of stock'}</div>
              <span className="quantityLabel" id="detail-quantity-label">Quantity</span>
              <div className="quantityStepper" role="group" aria-labelledby="detail-quantity-label">
                <button className="quantityButton" type="button" aria-label="Decrease quantity" disabled={!inventory || this.state.quantity === 1} onClick={this.decreaseQuantity}>−</button>
                <output className="quantityValue" aria-live="polite">{this.state.quantity}</output>
                <button className="quantityButton" type="button" aria-label="Increase quantity" disabled={!inventory} onClick={this.increaseQuantity}>+</button>
              </div>
              <button className="addCartButton" disabled={!inventory} onClick={this.addQuantityToCart}>Add to cart</button>
              <button className="buyNowButton" disabled={!inventory} onClick={this.buyNow}>Buy now</button>
              <dl><dt>Ships from</dt><dd>At Sea Shop</dd><dt>Sold by</dt><dd>{product.brand}</dd><dt>Returns</dt><dd>30-day refund</dd></dl>
              <button className="wishlistButton" aria-pressed={this.state.wishedFor} onClick={() => this.setState({ wishedFor: !this.state.wishedFor })}>{this.state.wishedFor ? '♥ Added to wish list' : '♡ Add to wish list'}</button>
            </aside>
          </section>

          <section className="detailReviews" id="reviews">
            <div className="reviewSummary">
              <h2>Customer reviews</h2>
              <div className="summaryScore"><strong>{product.rating}</strong><span><b>★★★★★</b><small>Based on {product.reviewCount} ratings</small></span></div>
              {[5, 4, 3, 2, 1].map((star, index) => <div className="ratingBar" key={star}><span>{star} star</span><i><em style={{ width: `${[74, 18, 5, 2, 1][index]}%` }} /></i><span>{[74, 18, 5, 2, 1][index]}%</span></div>)}
              <hr /><h3>Share your thoughts</h3><p>Help other shoppers make the right choice.</p><button className="reviewButton" onClick={() => this.setState({ showReviewForm: !this.state.showReviewForm })}>Write a customer review</button>
              {this.state.showReviewForm ? <form className="reviewForm" onSubmit={this.submitReview}><label>Your name<input required value={this.state.reviewName} onChange={event => this.setState({ reviewName: event.target.value })} /></label><label>Rating<select value={this.state.reviewRating} onChange={event => this.setState({ reviewRating: Number(event.target.value) })}>{[5, 4, 3, 2, 1].map(rating => <option value={rating} key={rating}>{rating} stars</option>)}</select></label><label>Review title<input required value={this.state.reviewTitle} onChange={event => this.setState({ reviewTitle: event.target.value })} /></label><label>Your review<textarea required value={this.state.reviewText} onChange={event => this.setState({ reviewText: event.target.value })} /></label><button type="submit">Submit review</button></form> : null}
            </div>
            <div className="reviewList">
              <div className="reviewListHeader"><div><span className="detailBrand">Top reviews</span><h2>What customers are saying</h2></div><select aria-label="Sort reviews" value={this.state.reviewSort} onChange={event => this.setState({ reviewSort: event.target.value })}><option value="recent">Most recent</option><option value="rated">Top rated</option></select></div>
              {this.getSortedReviews().map((comment, index) => <article className="reviewCard" key={`${comment.name}-${comment.title}`}><div className="reviewAvatar">{comment.name.charAt(0)}</div><div><strong>{comment.name}</strong><div className="commentStars">{'★★★★★'.slice(0, comment.rating)} <b>{comment.title}</b></div><small>Reviewed on {comment.date}</small>{comment.verified ? <span className="verifiedPurchase">Verified purchase</span> : null}<p>{comment.text}</p><div className="reviewHelpful">Was this helpful? <button disabled={this.state.helpfulReviews[index]} onClick={() => this.setState({ helpfulReviews: { ...this.state.helpfulReviews, [index]: true } })}>{this.state.helpfulReviews[index] ? 'Thanks!' : 'Yes'}</button></div></div></article>)}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }
}

ProductDetails.propTypes = {
  product: PropTypes.object,
  productsLoaded: PropTypes.bool,
  addToCart: PropTypes.func.isRequired
}
