import React from 'react';
import './styles.css'

const scrollToSection = id => {
  const section = document.getElementById(id)
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const Header = () => (
  <header className='headerSection'>
    <div className='headerContent'>
      <span className='headerKicker'>New season essentials</span>
      <h1 className='headerTitle'>Thoughtfully chosen goods for everyday living.</h1>
      <p className='headerSubtitle'>Shop practical, modern favorites across style, home, wellness, beauty, and tech — all in a cleaner, faster storefront.</p>
      <div className='headerActions'>
        <button className='primaryHeroButton' type='button' onClick={() => scrollToSection('shop')}>Shop the catalog</button>
        <button className='secondaryHeroButton' type='button' onClick={() => scrollToSection('featured-benefits')}>Why shop with us</button>
      </div>
    </div>
    <div className='headerCard' id='featured-benefits'>
      <div><strong>Free shipping</strong><span>On orders over $75</span></div>
      <div><strong>Easy returns</strong><span>30-day return window</span></div>
      <div><strong>Top rated</strong><span>Curated customer favorites</span></div>
    </div>
  </header>
)

export default Header;
