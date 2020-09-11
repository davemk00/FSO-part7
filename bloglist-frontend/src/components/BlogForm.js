import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import { Form, Input, Button } from 'antd'

const BlogForm = () => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogURL, setNewBlogURL] = useState('')

  const user = useSelector((state) => state.login)
  const dispatch = useDispatch()

  const handleTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }
  const handleURLChange = (event) => {
    setNewBlogURL(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogURL,
    }
    dispatch( createBlog(blog, user) )
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogURL('')

    dispatch(setNotification({
      msg: `blog ${blog.title} by ${blog.author} added`,
      type: 'success'
    }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }


  return (
    <div className="formDiv">
      <Form onSubmit={addBlog}>
        <h3>New blog:</h3>
        <Form.Item 
          label='Title'
          name='title'
          value={newBlogTitle}
          onChange={handleTitleChange}>
            <Input />
        </Form.Item>
        
        <Form.Item 
          label='Author'
          name='author'
          value={newBlogAuthor}
          onChange={handleAuthorChange}>
            <Input />
        </Form.Item>

        <Form.Item 
          label='url'
          name='url'
          value={newBlogURL}
          onChange={handleURLChange}>
            <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default BlogForm
