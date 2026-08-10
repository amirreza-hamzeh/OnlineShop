import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router'
import ProductItem from '../../components/ProductItem'
import { categoryPath } from '../../utils/catalogPath'
import './styles.css'

const ALL = 'All'

export default class ProductsList extends Component {
  state = {
    category: this.props.category || ALL,
    isCategoryMenuOpen: false,
    query: '',
    sort: 'featured'
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('click', this.handleDocumentClick)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('click', this.handleDocumentClick)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.category !== this.props.category) {
      this.setState({ category: nextProps.category || ALL, query: '' })
    }
  }

  handleKeyDown = event => {
    if (event.key === 'Escape' && this.state.isCategoryMenuOpen) {
      this.setState({ isCategoryMenuOpen: false })
      if (this.categoryMenuButton) this.categoryMenuButton.focus()
    }
  }

  handleDocumentClick = event => {
    if (this.state.isCategoryMenuOpen && this.categoryMenu && !this.categoryMenu.contains(event.target)) {
      this.setState({ isCategoryMenuOpen: false })
    }
  }

  selectCategory = category => {
    this.setState({ category, isCategoryMenuOpen: false, query: '' })
    hashHistory.push(category === ALL ? '/' : categoryPath(category))
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
        <div className="categoryMenu" ref={menu => { this.categoryMenu = menu }}>
          <button
            className="categoryMenuButton"
            type="button"
            ref={button => { this.categoryMenuButton = button }}
            aria-controls="category-menu-list"
            aria-expanded={this.state.isCategoryMenuOpen}
            aria-haspopup="true"
            aria-label={`Browse product categories. Current category: ${this.state.category}`}
            onClick={() => this.setState({ isCategoryMenuOpen: !this.state.isCategoryMenuOpen })}
          >
            <span className="hamburgerIcon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>Categories</span>
            <span className="selectedCategory">{this.state.category}</span>
          </button>
          {this.state.isCategoryMenuOpen && (
            <div className="categoryMenuList" id="category-menu-list" role="menu">
              {categories.map(category => (
                <button
                  className={category === this.state.category ? 'categoryMenuItem categoryMenuItemActive' : 'categoryMenuItem'}
                  key={category}
                  type="button"
                  role="menuitem"
                  onClick={() => this.selectCategory(category)}
                >
                  <span>{category}</span>
                  <span className="categoryCount">
                    {category === ALL ? this.props.products.length : this.props.products.filter(product => product.category === category).length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
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
  category: PropTypes.string,
}
