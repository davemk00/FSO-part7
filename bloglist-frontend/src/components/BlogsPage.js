import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogsPage = () => {
  const blogs = useSelector((state) => state.blog)

  const blogRows = () => (
    <div>
      {blogs.map(blog =>
        blogRow(blog)
      )}
    </div>
  )

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogRow = (blog) => (
    <div style={blogStyle} key= {blog.id}>
      <b>
        <Link to={`/blog/${blog.id}`}>
          {blog.title}
        </Link>
      </b> {blog.author}
    </div>
  )

  return (
    <div>
      <h3>Blogs: </h3>
      {blogRows()}
    </div>
  )
}

export default BlogsPage
