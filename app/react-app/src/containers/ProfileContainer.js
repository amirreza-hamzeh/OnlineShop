import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import imageUrl from '../utils/imageUrl'
import shop from '../api/shop'
import { getJwtToken, removeJwtToken } from '../actions/storage'
import { createAuthLocation } from '../authNavigation'
import { emptyProfileAddress, formatProfileAddress, parseProfileAddress } from '../utils/profileAddress'
import './ProfileContainer.css'

export default class ProfileContainer extends Component {
  active = false
  loadRequestId = 0
  state = {
    items: [], loading: true, error: '', profileLoading: true, profileError: '',
    profile: { name: '', email: '', phone: '', address: '' }, address: emptyProfileAddress(),
    editing: false, saving: false, saved: false
  }

  componentDidMount() {
    this.active = true
    if (!getJwtToken()) {
      hashHistory.replace(createAuthLocation('/sign-in', { pathname: '/profile' }))
      return
    }
    this.loadWishlist()
    this.loadProfile()
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

  loadProfile = () => {
    shop.getProfile((error, profile) => {
      if (!this.active) return
      if (error) {
        if (error.status === 401) return this.signInAgain()
        this.setState({ profileLoading: false, profileError: 'We could not load your account details.' })
        return
      }
      const loadedProfile = profile || {}
      this.setState({ profile: loadedProfile, address: parseProfileAddress(loadedProfile.address), profileLoading: false, profileError: '' })
    })
  }

  signInAgain = () => {
    removeJwtToken()
    hashHistory.replace(createAuthLocation('/sign-in', { pathname: '/profile' }))
  }

  changeProfile = event => {
    const { name, value } = event.target
    this.setState(previous => ({ profile: { ...previous.profile, [name]: value }, saved: false }))
  }

  changeAddress = event => {
    const { name, value } = event.target
    this.setState(previous => ({ address: { ...previous.address, [name]: value }, saved: false }))
  }

  saveProfile = event => {
    event.preventDefault()
    const profile = this.state.profile
    const address = this.state.address
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email || '')
    const phoneValid = (profile.phone || '').replace(/\D/g, '').length >= 7
    const addressComplete = Object.keys(address).every(key => (address[key] || '').trim())
    if (!(profile.name || '').trim() || !emailValid || !phoneValid || !addressComplete) {
      this.setState({ profileError: 'Enter a valid name, email, phone number, and complete delivery address.' })
      return
    }
    const profileToSave = { ...profile, address: formatProfileAddress(address) }
    this.setState({ saving: true, profileError: '', saved: false })
    shop.updateProfile(profileToSave, (error, savedProfile) => {
      if (!this.active) return
      if (error) {
        if (error.status === 401) return this.signInAgain()
        this.setState({ saving: false, profileError: 'We could not save your details. Please try again.' })
        return
      }
      this.setState({ profile: savedProfile, address: parseProfileAddress(savedProfile.address), saving: false, editing: false, saved: true })
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
        <TopNav location={this.props.location} solid />
        <main className="profileShell">
          <span className="profileEyebrow">Your account</span>
          <h1>My profile</h1>
          <section className="accountPanel" aria-labelledby="account-details-heading">
            <div className="accountPanelHeading">
              <div><span className="profileIcon" aria-hidden="true">&#9786;</span><h2 id="account-details-heading">Account details</h2><p>Keep these ready for a faster, smoother checkout.</p></div>
              {!this.state.editing && !this.state.profileLoading ? <button onClick={() => this.setState({ editing: true, saved: false })}>Edit profile</button> : null}
            </div>
            {this.state.profileLoading ? <p className="profileStatus">Loading your details…</p> : null}
            {this.state.profileError ? <p className="profileError" role="alert">{this.state.profileError}</p> : null}
            {this.state.saved ? <p className="profileSaved" role="status">&#10003; Your details are saved and ready for checkout.</p> : null}
            {!this.state.profileLoading && this.state.editing ? <form className="profileForm" onSubmit={this.saveProfile}>
              <label>Full name<input name="name" value={this.state.profile.name || ''} onChange={this.changeProfile} autoComplete="name" /></label>
              <div className="profileFormRow"><label>Email address<input name="email" type="email" value={this.state.profile.email || ''} onChange={this.changeProfile} autoComplete="email" /></label><label>Phone number<input name="phone" type="tel" value={this.state.profile.phone || ''} onChange={this.changeProfile} autoComplete="tel" /></label></div>
              <fieldset className="addressFields"><legend>Saved delivery address</legend>
                <label>Street address<textarea name="street" rows="2" value={this.state.address.street} onChange={this.changeAddress} autoComplete="street-address" placeholder="123 Market Street, apartment 4B" /></label>
                <div className="profileFormRow"><label>City<input name="city" value={this.state.address.city} onChange={this.changeAddress} autoComplete="address-level2" /></label><label>State / region<input name="region" value={this.state.address.region} onChange={this.changeAddress} autoComplete="address-level1" /></label></div>
                <div className="profileFormRow"><label>ZIP / postal code<input name="postalCode" value={this.state.address.postalCode} onChange={this.changeAddress} autoComplete="postal-code" /></label><label>Country<input name="country" value={this.state.address.country} onChange={this.changeAddress} autoComplete="country-name" /></label></div>
              </fieldset>
              <p className="addressHint">Use a complete delivery address, including apartment or unit details. We will prefill it when you check out.</p>
              <div className="profileActions"><button type="submit" disabled={this.state.saving}>{this.state.saving ? 'Saving…' : 'Save changes'}</button><button type="button" onClick={() => { this.setState({ editing: false, profileError: '' }); this.loadProfile() }}>Cancel</button></div>
            </form> : null}
            {!this.state.profileLoading && !this.state.editing ? <div className="profileSummary">
              <div><span>Name</span><strong>{this.state.profile.name || 'Not provided'}</strong></div><div><span>Email</span><strong>{this.state.profile.email || 'Not provided'}</strong></div><div><span>Phone</span><strong>{this.state.profile.phone || 'Not provided'}</strong></div>
              <article className="addressCard"><div className="addressCardHeader"><span aria-hidden="true">&#8962;</span><div><b>Default delivery address</b><small>Used at checkout</small></div></div><p>{this.state.profile.address || 'Add an address to make checkout faster.'}</p><span className="defaultBadge">Default</span></article>
            </div> : null}
          </section>
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
