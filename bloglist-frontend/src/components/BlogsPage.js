import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import blogService from '../services/blogs'
import { setBlogs } from '../reducers/blogReducer'
import dispNotification from '../App'

const BlogsPage = () => {
  const blogs = useSelector((state) => state.blog)
  const blogFormRef = React.createRef()
  const user = useSelector((state) => state.login)


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  const blogRows = () => (
    <div>
      {blogs.map(blog =>
        blogRow(blog)
      )}
    </div>
  )

  const blogRow = (blog) => (
    <div style={blogStyle} key= {blog.id}>
      <b>
        <Link to={`/blog/${blog.id}`}>
          {blog.title}
        </Link>
      </b> {blog.author}
    </div>
  )

  const newBlogForm = () => (
    <Togglable buttonLabel='New Blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const result = await blogService.create(blogObject)
    setBlogs( blogs.concat(result) )
    dispNotification({
      msg: `a new blog ${result.title} by ${result.author} has been added`,
      type: 'success'
    })
  }

  return (
    <div>
      <h2>Blogs: </h2>

      {!user.username ?
        <div>
        </div> :
        <div>
          {newBlogForm()}
        </div>
      }
      {blogRows()}
    </div>
  )
}

export default BlogsPage
