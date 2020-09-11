import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import { Link, useHistory } from 'react-router-dom'
import CommentForm from './CommentForm'
import { Button, Divider, Row, Col } from 'antd'

const BlogView = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const id = useParams().id
  const blogs = useSelector((state) => state.blog)
  const user = useSelector((state) => state.login)

  if (!blogs) {    return null  }
  const blog = blogs.find(n => n.id === id)
  if (!blog) {    return null  }
  
  const dispNotification = ({msg, type}) => {
    dispatch(setNotification({
      notification: msg,
      type: type,
    }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const blogRow = (blog) => (
    <>    
      <Row key={blog.id}>
        <Col span={4}>
          <h3>
            <Link to={`/blog/${blog.id}`}>
              {blog.title}
            </Link>
          </h3>
        </Col>
        <Col span={3}>
          {((blog.user !== null) && (user.id === blog.user.id)) && <Button type="primary" onClick={() => removeBlog(blog)}>Remove</Button>}
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <a href={blog.url}>{blog.url}</a>
        </Col>
      </Row>
      <Row>
        <Col>
          {blog.author}
        </Col>
      </Row>
      <Row>
        <Col>
          <span className='likes'>
            <span className='numLikes'> {blog.likes} </span> likes
            <Button size='small' type="primary" onClick={() => updateLikes(blog)}>Like</Button>
          </span>
        </Col>
      </Row>
    </>
  )


  const updateLikes = async (blog) => {
    dispatch( likeBlog(blog) )
    dispNotification({
      msg: `blog ${blog.title} by ${blog.author} has been liked`,
      type: 'success'
    })
  }

  const removeBlog = async (blog) => {
    try {
      if (window.confirm(`Confirm Delete Blog: ${blog.title} by ${blog.author}`)) {
        dispatch( deleteBlog(blog.id) )
        dispNotification({
          msg: `Blog ${blog.title} removed successfully`,
          type: 'success'
        })
        history.push('/')
      }
    } catch (exception) {
      console.log(exception)
      dispNotification({
        msg: exception.response.data.error,
        type: 'error'
      })
    }
  }

  return (
    <div>
      <Divider />
      {blogRow(blog)}
      <Divider />
      <h4>Comments</h4>
      {blog.comments.map(comment =>
        <Row key={comment.id}>
          <Col>
            {comment.content}
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <CommentForm />
        </Col>
      </Row>
    </div>
  )
}

export default BlogView