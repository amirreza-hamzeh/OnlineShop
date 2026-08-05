import React, { Component, PropTypes } from 'react'
import ProductItem from '../../components/ProductItem'
import './styles.css'

const ALL = 'All'

export default class ProductsList extends Component {
  state = {
    category: ALL,
    query: '',
    sort: 'featured'
  }

  getCategories(products) {
    return [ALL].concat(products.reduce((categories, product) => {
      if (product.category && categories.indexOf(product.category) === -1) {
        categories.push(product.category)
      }
      return categories
    }, []))
  }

  getFilteredProducts() {
    const { products } = this.props
    const { category, query, sort } = this.state
    const normalizedQuery = query.trim().toLowerCase()

    return products
      .filter(product => category === ALL || product.category === category)
      .filter(product => {
        if (!normalizedQuery) return true
        return [product.name, product.brand, product.description, product.category]
          .join(' ')
          .toLowerCase()
          .indexOf(normalizedQuery) !== -1
      })
      .sort((first, second) => {
        if (sort === 'price-low') return first.price - second.price
        if (sort === 'price-high') return second.price - first.price
        if (sort === 'rating') return (second.rating || 0) - (first.rating || 0)
        return (second.isFeatured ? 1 : 0) - (first.isFeatured ? 1 : 0)
      })
  }

  renderToolbar(categories) {
    return (
      <div className="catalogToolbar">
        <label className="catalogSearchLabel" htmlFor="catalog-search">Search products</label>
        <input
          id="catalog-search"
          className="catalogSearch"
          type="search"
          placeholder="Search bags, tech, fitness..."
          value={this.state.query}
          onChange={event => this.setState({ query: event.target.value })}
        />
        <select
          className="catalogSelect"
          aria-label="Filter products by category"
          value={this.state.category}
          onChange={event => this.setState({ category: event.target.value })}
        >
          {categories.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
        <select
          className="catalogSelect"
          aria-label="Sort products"
          value={this.state.sort}
          onChange={event => this.setState({ sort: event.target.value })}
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="rating">Best rated</option>
        </select>
      </div>
    )
  }

  render() {
    const { products, addToCart } = this.props
    const categories = this.getCategories(products)
    const visibleProducts = this.getFilteredProducts()

    return (
      <section className="catalogSection" id="shop">
        <div className="catalogHeader">
          <span className="eyebrow">Curated picks</span>
          <h2>Shop everyday favorites</h2>
          <p>Discover practical goods for home, style, wellness, and work with quick filters and keyboard-friendly controls.</p>
        </div>
        {this.renderToolbar(categories)}
        {visibleProducts.length ? (
          <div className="productListWrapper">
            {visibleProducts.map(product => (
              <ProductItem
                key={product.productId}
                product={product}
                onAddToCartClicked={addToCart}
              />
            ))}
          </div>
        ) : <div className="catalogEmpty">No products match your search. Try another category or keyword.</div>}
      </section>
    )
  }
}

ProductsList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
  })).isRequired,
  addToCart: PropTypes.func.isRequired,
}
