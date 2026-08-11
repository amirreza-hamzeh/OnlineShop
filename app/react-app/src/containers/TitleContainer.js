import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  getTotalProducts,
} from '../reducers'

import Title from '../components/Title'

const TitleContainer = ({ totalProducts }) => (
  <Title
    totalProducts={totalProducts}
   />
)

TitleContainer.propTypes = {
  totalProducts: PropTypes.number,
}

const mapStateToProps = (state) => ({
  totalProducts: getTotalProducts(state),
})

export default connect(mapStateToProps)(TitleContainer)
