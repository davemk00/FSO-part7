import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import blogService from '../services/blogs'
import { login, logout } from '../reducers/loginReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const NavBar = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => state.login)
  const dispatch = useDispatch()

  const dispNotification = ({msg, type}) => {
    dispatch(setNotification({
      notification: msg,
      type: type,
    }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }


  const navStyle = {
    margin: 0,
    padding: 0,
    display: 'inline',
    marginLeft: 10,
  }

  const loginForm = () => (
    <form onSubmit={handleLogin} style={navStyle}>
      <span style={navStyle}>
        username
        <input
          className="entry"
          type="Username"
          value={username}
          id="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </span>
      <span style={navStyle}>
        password
        <input
          className="entry"
          type="password"
          value={password}
          id="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </span>
      <button id="login-submit" type="submit" style={navStyle}>login</button>
    </form>
  )

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
    <span style={navStyle}>
      <b>{ user.name }</b> logged in. 
      <button type="submit" onClick={handleLogout} id="logoutButton" >logout</button>
    </span>
  )

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out')
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.unsetToken()
      dispatch(logout())
      console.log('user logged out')
    } catch (exception) {
      console.log('not logged out')
    }
  }

  return (
    <div>
      <Link style={{padding: 5}} to="/blogs">blogs</Link>
      <Link style={{padding: 5}} to="/users">users</Link>
      
      {!user.username ?
        loginForm()
      :
        logoutForm()
      }
    </div>
  )
}

export default NavBar