import React from 'react'
import { Link } from 'react-router'
import './styles.css'

const Logo = () => (
  <Link className="shopLogo" to="/" aria-label="OnlineShop home">
    OnlineShop
  </Link>
)

export default Logo
