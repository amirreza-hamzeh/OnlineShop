import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Product from '../../components/Product'
import CustomerInfoForm from '../../components/CustomerInfoForm'
import './styles.css'

class Checkout extends Component {
  renderProductList() {
    const { products } = this.props

    return products.length ? products.map(product => (
      <Product
        name={product.name}
        price={product.price}
        quantity={product.quantity}
        image={product.image}
        key={product.productId}
      />
    )) : (
      <div className="checkoutEmpty">
        <span className="checkoutEmptyIcon">+</span>
        <strong>Your cart is waiting</strong>
        <span>Add a few favorites before checking out.</span>
        <Link to="/">Browse products</Link>
      </div>
    )
  }

  renderCartTotal() {
    const { total } = this.props
    const subtotal = Number(total || 0)
    const shipping = 0
    const taxes = subtotal * .06
    const finalTotal = subtotal + shipping + taxes

    return (
      <div className="orderTotals">
        <div><span>Subtotal</span><span>{`$${subtotal.toFixed(2)}`}</span></div>
        <div><span>Shipping</span><span className="freeShipping">FREE</span></div>
        <div><span>Estimated tax</span><span>{`$${taxes.toFixed(2)}`}</span></div>
        <div className="orderTotalFinal"><span>Order total</span><strong>{`$${finalTotal.toFixed(2)}`}</strong></div>
      </div>
    )
  }

  render() {
    const itemCount = this.props.products.reduce((count, product) => count + product.quantity, 0)

    return (
      <div className="checkoutPage">
        <header className="checkoutNav">
          <Link className="checkoutBrand" to="/">
            <span className="checkoutBrandMark">A</span>
            <span>AtSea</span>
          </Link>
          <div className="secureCheckout"><span aria-hidden="true">&#128274;</span> Secure checkout</div>
        </header>

        <main className="checkoutShell">
          <nav className="checkoutSteps" aria-label="Checkout progress">
            <span className="complete"><b>&#10003;</b> Cart</span>
            <i />
            <span className="active"><b>2</b> Payment</span>
            <i />
            <span><b>3</b> Confirmation</span>
          </nav>

          <div className="checkoutIntro">
            <span className="checkoutEyebrow">Almost there</span>
            <h1>Complete your order</h1>
            <p>Fast, protected, and designed to get you back to what matters.</p>
          </div>

          <div className="checkoutGrid">
            <section className="checkoutFormCard" aria-labelledby="payment-heading">
              <CustomerInfoForm onSubmit={this.props.handleSubmit} hasProducts={this.props.products.length > 0} />
            </section>

            <aside className="orderCard" aria-label="Order summary">
              <div className="orderCardHeader">
                <div><span>Order summary</span><small>{itemCount} {itemCount === 1 ? 'item' : 'items'}</small></div>
                <Link to="/">Edit cart</Link>
              </div>
              <div className="orderProducts">{this.renderProductList()}</div>
              {this.renderCartTotal()}
              <div className="deliveryNote">
                <span aria-hidden="true">&#9889;</span>
                <div><strong>Free express delivery</strong><small>Estimated arrival in 2–4 business days</small></div>
              </div>
            </aside>
          </div>

          <div className="checkoutTrust">
            <span>&#128274; Encrypted payment</span>
            <span>&#8634; 30-day returns</span>
            <span>&#10024; Friendly support</span>
          </div>
        </main>
      </div>
    )
  }
}

Checkout.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired
  })).isRequired,
  total: PropTypes.string,
  handleSubmit: PropTypes.func
}

export default Checkout
