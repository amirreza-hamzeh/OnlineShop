import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  checkout,
  createOrder,
  purchaseOrder,
  incrementCartItem,
  decrementCartItem,
  removeFromCart,
} from '../actions'
import { getTotal, getCartProducts, getTotalProducts, getCustomerId, getQuantityById } from '../reducers'
import SuccessMessage from '../components/SuccessMessage'
import Checkout from '../components/Checkout'
import { SubmissionError } from 'redux-form'
import { getJwtToken } from '../actions/storage'
import shop from '../api/shop'


class CheckoutContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderComplete: false,
      profile: null,
    }
  }

  componentDidMount() {
    if (getJwtToken()) shop.getProfile((error, profile) => {
      if (!error) this.setState({ profile })
    })
  }

  handleSuccess = () => {
    this.setState({ orderComplete: true })
  }

  handleSubmit = (values) => {
    const {
      customerId,
      createOrder,
      purchaseOrder,
      totalProducts,
      quantityById,
      products,
      checkout
    } = this.props

    // This data will be used for create order endpoint
    const date = moment().format()
    const submitData = {
      customerId,
      orderDate: date,
      quantityById
    }

    if (totalProducts === 0) {
      throw new SubmissionError({ _error: "Please add to cart first..." })
    }
    if (!getJwtToken()) {
      throw new SubmissionError({ _error: "Please sign in before completing your order." })
    }

    return createOrder(submitData)
      .then(() => purchaseOrder())
      .then(() => {
        checkout(products)
        this.handleSuccess()
      })
      .catch((err) => {
        const message = err && err.status === 401
          ? "Please sign in before completing your order."
          : "We couldn't process your order. Check your details and try again."
        throw new SubmissionError({ _error: message })
      })
  }

  renderCheckout() {
    const { products, total, totalProducts, checkout } = this.props
    return (
      <Checkout
        products={products}
        total={total}
        totalProducts={totalProducts}
        onCheckoutClicked={() => checkout(products)}
        handleSubmit={this.handleSubmit}
        profile={this.state.profile}
        onIncrement={this.props.incrementCartItem}
        onDecrement={this.props.decrementCartItem}
        onRemove={this.props.removeFromCart}
      />
    );
  }

  renderSuccess() {
    const successMessage = "You have successfully placed an order!"
    return (
      <SuccessMessage
        message={successMessage}
        label="Continue Shopping"
      />
    );
  }

  render() {
    return (
      <div>
        {this.state.orderComplete ?
          this.renderSuccess()
          : this.renderCheckout()
        }
      </div>
    );
  }
}

CheckoutContainer.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  })).isRequired,
  total: PropTypes.string,
  totalProducts: PropTypes.number.isRequired,
  customerId: PropTypes.number,
  quantityById: PropTypes.object.isRequired,
  checkout: PropTypes.func.isRequired,
  createOrder: PropTypes.func.isRequired,
  purchaseOrder: PropTypes.func.isRequired,
  incrementCartItem: PropTypes.func.isRequired,
  decrementCartItem: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  products: getCartProducts(state),
  total: getTotal(state),
  totalProducts: getTotalProducts(state),
  customerId: getCustomerId(state),
  quantityById: getQuantityById(state),
})

export default connect(
  mapStateToProps,
  { checkout, createOrder, purchaseOrder, incrementCartItem, decrementCartItem, removeFromCart }
)(CheckoutContainer)
