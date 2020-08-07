import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Notification from './Notification'

describe('Notification component', () => {
  let component
  
  test('renders error message correctly', () => {
    component = render(<Notification message={ 'errorMessageTest' } type={ 'error' } />)
    expect(
      component.container.querySelector('.Notification error')
    ).toBeDefined()
  })
  
  test('renders information message correctly', () => {
    component = render(<Notification message={ 'normalMessageTest' } />)
    expect(
      component.container.querySelector('.Notification')
    ).toBeDefined()
    expect(
      component.container.querySelector('.error')
    ).toBeNull()
  })

  // test('at start the children are not displayed', () => {
  //   const div = component.container.querySelector('.togglableContent')

  //   expect(div).toHaveStyle('display: none')
  // })

  // test('after clicking the button, children are displayed', () => {
  //   const button = component.getByText('show...')
  //   fireEvent.click(button)

  //   const div = component.container.querySelector('.togglableContent')
  //   expect(div).not.toHaveStyle('display: none')
  // })

  // test('toggled content can be closed', () => {
  //   const button = component.container.querySelector('button')
  //   fireEvent.click(button)
  
  //   const closeButton = component.getByText('cancel')
  //   fireEvent.click(closeButton)
  
  //   const div = component.container.querySelector('.togglableContent')
  //   expect(div).toHaveStyle('display: none')
  // })
})