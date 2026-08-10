import React, { PropTypes } from 'react'
import GradientBackground from '../components/GradientBackground'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TitleContainer from './TitleContainer'
import ProductsContainer from './ProductsContainer'

const App = ({ location, params }) => (
  <div>
    <GradientBackground />
    <TopNav location={location} />
    <Header />
    <TitleContainer />
    <ProductsContainer category={params.category} />
    <Footer />
  </div>
)

App.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
}

export default App
