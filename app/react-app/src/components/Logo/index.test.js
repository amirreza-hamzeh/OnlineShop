import React from 'react'
import { Link } from 'react-router'
import Logo from './index'

describe('Logo', () => {
  it('renders the OnlineShop brand as an accessible home-page link', () => {
    const logo = Logo()

    expect(logo.type).toBe(Link)
    expect(logo.props.to).toBe('/')
    expect(logo.props.className).toBe('shopLogo')
    expect(logo.props['aria-label']).toBe('OnlineShop home')
    expect(logo.props.children).toBe('OnlineShop')
  })
})
