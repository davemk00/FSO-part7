import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import blogService from '../services/blogs'
import { setBlogs } from '../reducers/blogReducer'
import dispNotification from '../App'
import { Layout, Row, Col } from 'antd'
const { Content } = Layout;

const BlogsPage = () => {
  const blogs = useSelector((state) => state.blog)
  const blogFormRef = React.createRef()
  const user = useSelector((state) => state.login)

  const blogRows = () => (
    <div>
      {blogs.map(blog =>
        blogRow(blog)
      )}
    </div>
  )

  const blogRow = (blog) => (
    <Row key={blog.id}>
      <Col span={6}>
        <div>
          <b>
          <Link to={`/blog/${blog.id}`}>
            {blog.title}
          </Link>
        </b>
        </div>
      </Col>
      <Col span={4}>
        {blog.author}
      </Col>
    </Row>
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
      <Row>
        <Col span={6}>
          <h2>Blogs: </h2>
        </Col>
        <Col span={4}>
          {!user.username ?
          <Content></Content>
          :
          <Content>
            {newBlogForm()}
          </Content>
          }
        </Col>
      </Row>
      {blogRows()}
    </div>
  )
}

export default BlogsPage
