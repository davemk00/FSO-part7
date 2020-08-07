import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogURL, setNewBlogURL] = useState('')

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
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogURL,
    })
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogURL('')
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

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
