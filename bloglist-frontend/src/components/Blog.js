import React, { useState } from 'react'
// import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  handleRemove,
  handleUpdate,
  showRemoveButton,
}) => {
  const [blogDetailsVisible, setBlogDetailsVisible] = useState(false)
  const hideWhenVisible = { display: blogDetailsVisible ? 'none' : '' }
  const showWhenVisible = { display: blogDetailsVisible ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const fullBlog = (
    <div style={showWhenVisible} className='blogShow'>
      <b>{blog.title}</b>
      <button onClick={() => setBlogDetailsVisible(false)}>Hide</button>
      <br/>
      {blog.url}
      <br />
      <div className='likes'>
        <span className='numLikes'> {blog.likes} </span> likes
        <button onClick={handleUpdate}>Like</button>
      </div>
      {blog.author}
      <br />
      {showRemoveButton && <button onClick={handleRemove}>Remove</button>}
    </div>
  )

  const shortBlog = (
    <div style={hideWhenVisible} className='blogHide'>
      <b>{blog.title}</b> {blog.author}
      <button onClick={() => setBlogDetailsVisible(true)}>Show</button>
    </div>
  )

  return (
    <div style={blogStyle}>
      {blogDetailsVisible ? fullBlog : shortBlog}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
  showRemoveButton: PropTypes.bool.isRequired
}

export default Blog
