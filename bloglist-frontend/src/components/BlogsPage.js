import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './Blog'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const BlogsPage = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blog)
  const user = useSelector((state) => state.login)

  const updateLikes = async (blog) => {
    dispatch( likeBlog(blog) )
    dispNotification({
      msg: `blog ${blog.title} by ${blog.author} has been liked`,
      type: 'success'
    })
  }

  const dispNotification = ({msg, type}) => {
    dispatch(setNotification({
      notification: msg,
      type: type,
    }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const removeBlog = async (blog) => {
    try {
      if (window.confirm(`Confirm Delete Blog: ${blog.title} by ${blog.author}`)) {
        dispatch( deleteBlog(blog.id) )
        // const newBlogs = blogs.filter(x => x.id !== blog.id)
        dispNotification({
          msg: `Blog ${blog.title} removed successfully`,
          type: 'success'
        })
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
      <h3>Blogs: </h3>
      {blogs.map(blog =>
        <Blog
          key = {blog.id}
          blog={blog}
          handleUpdate={() => updateLikes(blog)}
          handleRemove={() => removeBlog(blog)}
          showRemoveButton = {(user != null) && (user.id === blog.user.id)}
        />
      )}
    </div>
  )
}

export default BlogsPage
