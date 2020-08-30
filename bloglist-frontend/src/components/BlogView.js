import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import { Link, useHistory } from 'react-router-dom'
import CommentForm from './CommentForm'

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
    <div>
      <h3>
        <Link to={`/blog/${blog.id}`}>
          {blog.title}
        </Link>
      </h3>
      <br/>

      <a href={blog.url}>{blog.url}</a>
      <br />

      <div className='likes'>
        <span className='numLikes'> {blog.likes} </span> likes
        <button onClick={() => updateLikes(blog)}>Like</button>
      </div>
      {blog.author}
      <br />

      {((blog.user !== null) && (user.id === blog.user.id)) && <button onClick={() => removeBlog(blog)}>Remove</button>}
    </div>
    </>
  )

  const commentStyle = {
    marginLeft: 30,
  }

  const commentRow = (comment) => (
    <div key={comment.id}>
      <li style={commentStyle}>
        {comment.content}
      </li>
    </div>
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
      {blogRow(blog)}
      
      <h4>Comments</h4>
      <CommentForm />
      {blog.comments.map(comment =>
        commentRow(comment)
      )}
    </div>
  )
}

export default BlogView