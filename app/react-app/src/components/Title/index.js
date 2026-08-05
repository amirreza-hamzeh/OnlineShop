import React, { PropTypes } from 'react'
import Cart from '../../components/Cart'
import FlatButton from 'material-ui/FlatButton'
import { Link } from 'react-router'
import './styles.css'

const Title = ({ totalProducts, showItemAdded }) => (
  <div className='shopUtilityBar'>
    <div className='titleBar'>
      <div className='productsSection'>Modern marketplace</div>
      <div className='titleActions'>
        <Cart total={totalProducts} showItemAdded={showItemAdded} />
        <div className="checkout-button">
          <FlatButton
            style={{ color: '#fff', backgroundColor: '#0f766e', borderRadius: 999 }}
            labelStyle={{ textTransform: 'none', fontFamily: 'Open Sans', fontWeight: 700 }}
            label="Checkout"
            containerElement={<Link to="checkout"> Checkout </Link>}
          />
        </div>
      </div>
    </div>
  </div>
)

Title.propTypes = {
  totalProducts: PropTypes.number,
  showItemAdded: PropTypes.bool,
}

export default Title
