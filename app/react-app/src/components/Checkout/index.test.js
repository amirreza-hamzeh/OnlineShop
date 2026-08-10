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
      profile={{
        name: 'Alex Morgan',
        address: '123 Market Street\nApartment 4B\nSeattle, WA 98101\nUnited States'
      }}
    />)

    expect(wrapper.find(CustomerInfoForm).prop('initialValues')).toEqual({
      firstName: 'Alex',
      lastName: 'Morgan',
      address: '123 Market Street\nApartment 4B',
      city: 'Seattle',
      zipCode: '98101'
    })
  })

  it('does not put the registration placeholder into checkout', () => {
    const wrapper = shallow(<Checkout products={[]} total="0" profile={{ name: 'Alex', address: 'Not provided' }} />)
    expect(wrapper.find(CustomerInfoForm).prop('initialValues').address).toBe('')
  })
})
