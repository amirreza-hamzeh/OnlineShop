import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Logo from '../Logo'
import './styles.css'

const SuccessMessage = ({ message, label, handleClick }) => (
  <div className="successPage">
    <header className="successNav">
      <Logo />
      <div className="successSecure"><span aria-hidden="true">&#128274;</span> Secure checkout</div>
    </header>

    <main className="successShell">
      <nav className="successSteps" aria-label="Checkout progress">
        <span><b>&#10003;</b> Cart</span>
        <i />
        <span><b>&#10003;</b> Payment</span>
        <i />
        <span className="active"><b>&#10003;</b> Confirmation</span>
      </nav>

      <section className="successCard" aria-labelledby="success-title">
        <div className="successCelebration" aria-hidden="true">
          <span className="spark sparkOne">&#10022;</span>
          <span className="spark sparkTwo">&#10022;</span>
          <span className="successCheck"><svg viewBox="0 0 52 52"><path d="M15 27.5 23 35l15-18" /></svg></span>
          <span className="spark sparkThree">&#10022;</span>
          <span className="spark sparkFour">&#10022;</span>
        </div>

        <span className="successEyebrow">Order confirmed</span>
        <h1 id="success-title">Thank you for your order!</h1>
        <p className="successMessage">{message}</p>
        <p className="successReassurance">We are getting everything ready. A confirmation with your order details is on its way to your email.</p>

        <div className="successJourney" aria-label="What happens next">
          <div className="journeyItem complete">
            <span className="journeyIcon">&#10003;</span>
            <div><strong>Order placed</strong><small>Payment confirmed</small></div>
          </div>
          <i />
          <div className="journeyItem">
            <span className="journeyIcon">&#9633;</span>
            <div><strong>Preparing</strong><small>Next up</small></div>
          </div>
          <i />
          <div className="journeyItem">
            <span className="journeyIcon">&#8594;</span>
            <div><strong>On its way</strong><small>Tracking to follow</small></div>
          </div>
        </div>

        <div className="successActions">
          <Link className="successPrimaryButton" to="/" onClick={handleClick}>{label}<span aria-hidden="true">&#8594;</span></Link>
          <Link className="successSecondaryButton" to="/profile">View my profile</Link>
        </div>
      </section>

      <div className="successTrust">
        <span><b>&#128230;</b><span><strong>Carefully packed</strong><small>Prepared with care</small></span></span>
        <span><b>&#8634;</b><span><strong>30-day returns</strong><small>Simple and worry-free</small></span></span>
        <span><b>&#128274;</b><span><strong>Payment protected</strong><small>Your details stay secure</small></span></span>
      </div>
      <p className="successHelp">Need a hand? <Link to="/">Visit our shop</Link> and we will help you find your way.</p>
    </main>
  </div>
)

SuccessMessage.propTypes = {
  label: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
}

export default SuccessMessage
