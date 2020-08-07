import React, { useState, useEffect } from 'react'

import LoginForm from './components/Login'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  const blogFormRef = React.createRef()

  useEffect(() => {
    const getData = async () => {
      var blogs = await blogService.getAll()
      blogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    }
    getData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out')
    try {
      window.localStorage.removeItem('loggedBlogappUser')

      blogService.unsetToken()
      setUser(null)
      setUsername('')
      setPassword('')
      console.log('user logged out')
    } catch (exception) {
      console.log('not logged out')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setInfoMessage(`${username} Logged in`)
      setTimeout(() => {
        setInfoMessage(null)
        // console.log(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
        // console.log(null)
      }, 5000)
    }
  }

  const logoutForm = () => (
    <div>
      <div>
        { user.name } logged in.
        <button type="submit" onClick={handleLogout} id="logoutButton">logout</button>
      </div>
    </div>
  )

  const loginFormRef = React.createRef()
  
  const loginForm = () => (
    <Togglable buttonLabel='login' ref={loginFormRef} id="logoutButton">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
      />
    </Togglable>
  )


  const blogRows = () => (
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

  const updateLikes = async (blog) => {
    ++blog.likes
    const response = await blogService.update(blog.id, blog)
    blogs[blog.id] = response
    setBlogs(blogs)
    setInfoMessage(`blog ${response.title} by ${response.author} has been liked`)
    setTimeout(() => {
      setInfoMessage(null)
      // console.log(null)
    }, 3000)
  }

  const removeBlog = async (blog) => {
    try {
      if (window.confirm(`Confirm Delete Blog: ${blog.title} by ${blog.author}`)) {
        const response = await blogService.remove(blog.id)
        const newBlogs = blogs.filter(x => x.id !== blog.id)
        if (!response) {
          setBlogs(newBlogs)
          setInfoMessage(`Blog ${blog.title} removed successfully`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
      }
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const newBlogForm = () => (
    <Togglable buttonLabel='New Blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )
  
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const result = await blogService.create(blogObject)
    console.log(result)
    setBlogs(blogs.concat(result))
    setInfoMessage(`a new blog ${result.title} by ${result.author} has been added`)
    setTimeout(() => {
      setInfoMessage(null)
      console.log(null)
    }, 5000)
  }

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={ errorMessage } type={ 'error' } />
      <Notification message={ infoMessage } type={ 'info' } />

      {user === null ?
        <div>
          {loginForm()}
          {blogRows()}
        </div> :
        <div>
          {logoutForm()}
          <br/>
          {newBlogForm()}
          {blogRows()}
        </div>
      }
    </div>
  )
}

export default App