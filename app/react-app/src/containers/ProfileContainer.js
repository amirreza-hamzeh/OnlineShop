import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import imageUrl from '../utils/imageUrl'
import shop from '../api/shop'
import { getJwtToken, removeJwtToken } from '../actions/storage'
import { createAuthLocation } from '../authNavigation'
import './ProfileContainer.css'

export default class ProfileContainer extends Component {
  active = false
  loadRequestId = 0
  state = { items: [], loading: true, error: '' }

  componentDidMount() {
    this.active = true
    if (!getJwtToken()) {
      hashHistory.replace(createAuthLocation('/sign-in', { pathname: '/profile' }))
      return
    }
    this.loadWishlist()
  }

  componentWillUnmount() {
    this.active = false
    this.loadRequestId += 1
  }

  loadWishlist = () => {
    const requestId = ++this.loadRequestId
    shop.getWishlist((error, items) => {
      if (!this.active || requestId !== this.loadRequestId) return
      if (error) {
        if (error.status === 401) {
          removeJwtToken()
          hashHistory.replace(createAuthLocation('/sign-in', { pathname: '/profile' }))
          return
        }
        this.setState({ loading: false, error: 'We could not load your wish list. Please try again.' })
        return
      }
      this.setState({ items: items || [], loading: false, error: '' })
    })
  }

  remove = productId => {
    shop.removeFromWishlist(productId, error => {
      if (!this.active) return
      if (error) {
        if (error.status === 401) {
          removeJwtToken()
          hashHistory.replace(createAuthLocation('/sign-in', { pathname: '/profile' }))
          return
        }
        this.setState({ error: 'We could not remove that product. Please try again.' })
        return
      }
      this.setState(previous => ({ items: previous.items.filter(item => item.product.productId !== productId), error: '' }))
    })
  }

  render() {
    return (
      <div className="profilePage">
        <TopNav location={this.props.location} />
        <main className="profileShell">
          <span className="profileEyebrow">Your account</span>
          <h1>My profile</h1>
          <section className="wishlistPanel">
            <div><h2>Wish list</h2><p>Your saved products are stored here and available whenever you sign in.</p></div>
            {this.state.loading ? <p className="profileStatus">Loading your wish list…</p> : null}
            {this.state.error ? <p className="profileError" role="alert">{this.state.error}</p> : null}
            {!this.state.loading && !this.state.error && !this.state.items.length ? <div className="profileEmpty"><span>♡</span><h3>Your wish list is empty</h3><p>Save something you love and it will appear here.</p><Link to="/">Browse products</Link></div> : null}
            <div className="wishlistGrid">
              {this.state.items.map(item => <article className="wishlistCard" key={item.wishlistItemId}>
                <Link to={`/product/${item.product.productId}`}><img src={imageUrl(item.product.image)} alt={item.product.name} /></Link>
                <div><h3><Link to={`/product/${item.product.productId}`}>{item.product.name}</Link></h3><strong>${Number(item.product.price).toFixed(2)}</strong><button onClick={() => this.remove(item.product.productId)}>Remove</button></div>
              </article>)}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }
}
