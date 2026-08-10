import React from 'react'
import { shallow } from 'enzyme'
import { TextField } from 'material-ui'
import Input from './index'

const field = (error, touched = false) => ({
  input: { name: 'cardNumber', value: '', onChange: jest.fn() },
  meta: { error, touched }
})

describe('Input guidance', () => {
  it('connects helper text to the input and forwards mobile input constraints', () => {
    const wrapper = shallow(<Input field={field()} helperText="Paste your number" inputMode="numeric" maxLength={23} />)
    const input = wrapper.find(TextField)

    expect(input.prop('inputMode')).toBe('numeric')
    expect(input.prop('maxLength')).toBe(23)
    expect(input.prop('aria-describedby')).toBe('cardNumber-helper')
    expect(wrapper.find('#cardNumber-helper').text()).toBe('Paste your number')
  })

  it('replaces guidance with the validation error after the field is touched', () => {
    const wrapper = shallow(<Input field={field('Enter a valid card number', true)} helperText="Paste your number" />)

    expect(wrapper.find(TextField).prop('errorText')).toBe('Enter a valid card number')
    expect(wrapper.find(TextField).prop('aria-describedby')).toBe(undefined)
    expect(wrapper.find('.formHelper').exists()).toBe(false)
  })
})
