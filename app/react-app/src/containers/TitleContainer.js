import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  getTotalProducts,
  getLastAddedProduct,
  itemJustAddedSelector,
} from '../reducers'

import Title from '../components/Title'

const TitleContainer = ({ totalProducts, showItemAdded, lastAddedProduct }) => (
  <Title
    totalProducts={totalProducts}
    showItemAdded={showItemAdded}
    lastAddedProduct={lastAddedProduct}
   />
)

TitleContainer.propTypes = {
  totalProducts: PropTypes.number,
  showItemAdded: PropTypes.bool,
  lastAddedProduct: PropTypes.object,
}

const mapStateToProps = (state) => ({
  totalProducts: getTotalProducts(state),
  showItemAdded: itemJustAddedSelector(state),
  lastAddedProduct: getLastAddedProduct(state),
})

export default connect(mapStateToProps)(TitleContainer)
