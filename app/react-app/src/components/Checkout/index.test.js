import React from 'react'
import { shallow } from 'enzyme'
import { Checkout } from './index'
import CustomerInfoForm from '../../components/CustomerInfoForm'

describe('checkout saved profile', () => {
  it('prefills the payment form from a structured saved address', () => {
    const wrapper = shallow(<Checkout
      products={[]}
      total="0"
      handleSubmit={jest.fn()}
      profile={{ firstName: 'Alex', lastName: 'Morgan', streetAddress: '123 Market Street\nApartment 4B',
        city: 'Seattle', region: 'WA', postalCode: '98101', country: 'United States' }}
    />)

    expect(wrapper.find(CustomerInfoForm).prop('initialValues')).toEqual({
      firstName: 'Alex',
      lastName: 'Morgan',
      address: '123 Market Street\nApartment 4B',
      city: 'Seattle',
      zipCode: '98101'
    })
  })

  it('uses the separately saved first and last names instead of the username', () => {
    const wrapper = shallow(<Checkout products={[]} total="0" profile={{
      username: 'alex1987', firstName: 'Alex', lastName: 'Morgan', streetAddress: '1 Main St', city: 'Boston', postalCode: '02108'
    }} />)
    expect(wrapper.find(CustomerInfoForm).prop('initialValues')).toEqual(expect.objectContaining({
      firstName: 'Alex', lastName: 'Morgan', city: 'Boston', zipCode: '02108'
    }))
  })

  it('does not put the registration placeholder into checkout', () => {
    const wrapper = shallow(<Checkout products={[]} total="0" profile={{ name: 'Alex', address: 'Not provided' }} />)
    expect(wrapper.find(CustomerInfoForm).prop('initialValues').address).toBe('')
  })
})

describe('checkout order editing', () => {
  const product = { productId: 4, name: 'Watch', price: 25, quantity: 2, image: 'watch.png' }

  it('connects the quantity and remove controls to the selected product', () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()
    const onRemove = jest.fn()
    const wrapper = shallow(<Checkout
      products={[product]}
      total="50"
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onRemove={onRemove}
    />)
    const renderedProduct = wrapper.find('Product')

    renderedProduct.prop('onIncrement')()
    renderedProduct.prop('onDecrement')()
    renderedProduct.prop('onRemove')()

    expect(onIncrement).toHaveBeenCalledWith(4)
    expect(onDecrement).toHaveBeenCalledWith(4)
    expect(onRemove).toHaveBeenCalledWith(4)
  })
})
