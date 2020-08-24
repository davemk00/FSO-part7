import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"

import LoginForm from './components/Login'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { setNotification, clearNotification } from './reducers/notificationReducer'
import { login, setUser, logout } from './reducers/loginReducer'
import { setBlogs } from './reducers/blogReducer'
import { initialiseUsers } from './reducers/userReducer'
import UsersPage from './components/UsersPage'
import UserPage from './components/UserPage'
import BlogsPage from './components/BlogsPage.js'

import { useDispatch, useSelector } from 'react-redux'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = React.createRef()
  
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setBlogs())
    dispatch(initialiseUsers())
  }, [dispatch])

  const blogs = useSelector((state) => state.blog)
  const user = useSelector((state) => state.login)
  const users = useSelector((state) => state.users)
  
  useEffect(() => {
    // Getting the user if already logged in
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
      dispatch(logout())
      setUsername('')
      setPassword('')
      console.log('user logged out')
    } catch (exception) {
      console.log('not logged out')
    }
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
 

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    
    try {
      const user = await dispatch( login(username, password) )
      
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      
      dispNotification({
        msg: `${username} Logged in`,
        type: 'success'
      })
      
    } catch (exception) {
      dispNotification({
        msg: exception.response.data.error,
        type: 'error'
      })
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
    <Router>
      <div>
        <Link style={{padding: 5}} to="/blogs">blogs</Link>
        {/* <Link style={{padding: 5}} to="/users/:id">users</Link> */}
        <Link style={{padding: 5}} to="/users">users</Link>
      </div>

      <div>
        <h1>Blogs</h1>
        <Notification />
      </div>

      <div>
        {!user.username ?
          <div>
            {loginForm()}
          </div> :
          <div>
            {logoutForm()}
            <br/>
            {newBlogForm()}
          </div>
        }
      </div>

      <Switch>
        <Route path="/users/:id">
          <UserPage />
        </Route>
        <Route path="/users">
          <UsersPage />
        </Route>
        <Route path="/blogs">
          <BlogsPage />
        </Route>
      </Switch>

    </Router>
  )
}

export default App