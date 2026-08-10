import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { Field, reduxForm } from 'redux-form'
import Input from '../../components/Input'
import validate from './validate'
import { formatCardNumber, formatExpirationDate, formatSecurityCode, getCardBrand } from './cardFields'
import './styles.css'

class CustomerInfoForm extends Component {
  formattedField = (field, formatter) => ({
    ...field,
    input: {
      ...field.input,
      onChange: event => field.input.onChange(formatter(event.target.value))
    }
  })

  render() {
    const { handleSubmit, error, submitting, hasProducts } = this.props

    return (
      <div className="infoSection">
        <form onSubmit={handleSubmit}>
          <div className="formHeading">
            <span className="formHeadingIcon" aria-hidden="true">&#128179;</span>
            <div><h2 id="payment-heading">Payment details</h2><p>All transactions are secure and encrypted.</p></div>
          </div>

          <div className="paymentMethods" aria-label="Accepted payment methods">
            <span className="paymentMethod selected">Card <b>&#10003;</b></span>
            <span className="cardBadge visa">VISA</span>
            <span className="cardBadge">MC</span>
            <span className="cardBadge express">AMEX</span>
          </div>

          <div className="infoRow">
            <Field name="firstName" component={field => <Input field={field} label="First name" hintText="Alex" autoComplete="cc-given-name" />} />
            <Field name="lastName" component={field => <Input field={field} label="Last name" hintText="Morgan" autoComplete="cc-family-name" />} />
          </div>
          <Field name="cardNumber" component={field => {
            const formattedField = this.formattedField(field, formatCardNumber)
            const brand = getCardBrand(field.input.value)
            return <Input field={formattedField} label="Card number" hintText="1234 5678 9012 3456" autoComplete="cc-number" inputMode="numeric" maxLength={23} helperText={brand ? `${brand} detected` : 'Spaces are added automatically. You can also paste your number.'} />
          }} />
          <div className="infoRow compactRow">
            <Field name="expirationDate" component={field => <Input field={this.formattedField(field, formatExpirationDate)} label="Expiration date" hintText="MM / YY" autoComplete="cc-exp" inputMode="numeric" maxLength={7} helperText="Month / year" />} />
            <Field name="cvv" component={field => <Input field={this.formattedField(field, formatSecurityCode)} label="Security code" hintText="3 or 4 digits" autoComplete="cc-csc" type="password" inputMode="numeric" maxLength={4} helperText="On the back of most cards" />} />
          </div>

          <div className="billingHeading"><h3>Billing address</h3><span>Used for payment verification</span></div>
          <Field name="address" component={field => <Input field={field} label="Street address" hintText="123 Market Street" autoComplete="billing street-address" />} />
          <div className="infoRow compactRow">
            <Field name="city" component={field => <Input field={field} label="City" hintText="Seattle" autoComplete="billing address-level2" />} />
            <Field name="zipCode" component={field => <Input field={field} label="ZIP code" hintText="98101" autoComplete="billing postal-code" />} />
          </div>

          {error ? <div className="checkoutError" role="alert">{error}</div> : null}

          <button className="completeOrderButton" type="submit" disabled={submitting || !hasProducts}>
            <span>{submitting ? 'Processing securely…' : hasProducts ? 'Complete secure order' : 'Add items to continue'}</span>
            <b aria-hidden="true">&#8594;</b>
          </button>
          <div className="formFooter"><Link to="/">&#8592; Return to shop</Link><span>&#128274; Your information stays private</span></div>
        </form>
      </div>
    )
  }
}

CustomerInfoForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool,
  hasProducts: PropTypes.bool
}

CustomerInfoForm.defaultProps = { hasProducts: true }

export default reduxForm({ form: 'customerInfo', validate, enableReinitialize: true })(CustomerInfoForm)
