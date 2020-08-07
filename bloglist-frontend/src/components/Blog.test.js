import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

const blog = {
  title: 'test blog title',
  author: 'test blog Author',
  url: 'test blog URL',
  likes: 2,
  user: {
    name: 'test blog user name',
    username: 'test blog user username'
  }
}

test('default blog state renders content correctly', () => {
  const component = render(
    <Blog blog={blog} />
  )

  // component.debug()

  expect(component.container).toHaveTextContent(
    'test blog title test blog Author'
  )

  expect(component.container).not.toHaveTextContent(
    'test blog URL'
  )
  
  const div = component.container.querySelector('.blogHide')
  expect(div).toHaveTextContent(
    'test blog title test blog Author'
  )

  // console.log(prettyDOM(div))
})


test('after show button clicked, extended blog renders content correctly', () => {
  const component = render(
    <Blog blog={blog} />
  )

  const button = component.getByText('Show')
  fireEvent.click(button)

  // component.debug()

  expect(component.container).toHaveTextContent(
    'test blog URL'
  )
  expect(component.container).toHaveTextContent(
    '2 likes'
  )
  
  const div = component.container.querySelector('.blogShow')
  expect(div).toHaveTextContent(
    'test blog URL'
  )

  // console.log(prettyDOM(div))
})


test('when like button is clicked twice, handler is called twice', () => {
  const mockUpdateHandler = jest.fn()
  
  const component = render(
    <Blog blog={blog} handleUpdate={mockUpdateHandler} />
  )

  const showButton = component.getByText('Show')
  fireEvent.click(showButton)

  const likeButton = component.getByText('Like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)
  // console.log(mockUpdateHandler.mock)

  expect(mockUpdateHandler.mock.calls).toHaveLength(2)
})