// THIS DOESN"T WORK YET



import React, { useState } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import LoginForm from './Login'

const Wrapper = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleUsernameChange = event => {
    console.log(event)
    console.log(props)
    props.state.username = event.target.value
  }
  const handlePasswordChange = event => {
    props.state.password = event.target.value
  }
  
  return (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleLogin={props.onSubmit}
    />
  )
}
 
test('<LoginForm /> updates parent state and calls onSubmit', () => {
  const onSubmit = jest.fn()
  const state = {
    username: 'testU',
    password: 'testP'
  }

  const component = render(
    <Wrapper onSubmit={onSubmit} state={state} />
  )

  component.debug()
  
  const usernameInput = component.container.querySelector('#Username')
  const passwordInput = component.container.querySelector('#Password')
  const form = component.container.querySelector('form')
  
  console.log(usernameInput)
  fireEvent.change(usernameInput, {
    target: { value: 'test Username' }
  })
  // console.log(component.container)
  
  fireEvent.change(passwordInput, {
    target: { value: 'test Password for unit testing' }
  })
  
  console.log(usernameInput)
  // console.log(passwordInput)
  
  fireEvent.submit(form)

  
  expect(onSubmit.mock.calls).toHaveLength(1)
  expect(onSubmit.mock.calls[0][0].Username).toBe('test Username for unit testing' )
  // expect(onSubmit.mock.calls[0][0].Password).toBe('test Password for unit testing' )
})