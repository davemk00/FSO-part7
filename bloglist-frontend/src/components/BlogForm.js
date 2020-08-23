import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

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
      <form onSubmit={addBlog}>
        <h3>New blog:</h3>
        <div className="blogEntry">
          Title: <input
            id="title"
            className="entry"
            value={newBlogTitle}
            onChange={handleTitleChange}
          />
          <br></br>
      Author: <input
            id="author"
            className="entry"
            value={newBlogAuthor}
            onChange={handleAuthorChange}
          />
          <br></br>
      URL: <input
            id="url"
            className="entry"
            value={newBlogURL}
            onChange={handleURLChange}
          />
          <br></br>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
