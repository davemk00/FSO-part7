import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import blogService from '../services/blogs'
import { login, logout } from '../reducers/loginReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import { Form, Input, Button, Menu } from 'antd'


const NavBar = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => state.login)
  const dispatch = useDispatch()  
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const dispNotification = ({msg, type}) => {
    dispatch(setNotification({
      notification: msg,
      type: type,
    }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const loginForm = () => (
    <Form form={form} name="login" layout="inline">
      <Form.Item label="Username" name="username"
        onChange={({ target }) => setUsername(target.value)}
      >
        <Input />
      </Form.Item>

      <Form.Item class="ant-menu-item" label="Password" name="password"
        onChange={({ target }) => setPassword(target.value)}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item shouldUpdate={true}>
        {() => (
          <Button 
            type="primary" 
            onClick={handleLogin}
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Submit
          </Button>
        )}
      </Form.Item>
    </Form>
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    
    try {
      const user = await dispatch( login(username, password) )
      
      blogService.setToken(user.token)
      form.resetFields();
      
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
    <>
      <b>{ user.name }</b> logged in.      
      <Button type="primary" onClick={handleLogout} id="logoutButton" >logout</Button>
    </>
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
    
    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>

      <Menu.Item key="blogs">
        <Link to="/blogs">blogs</Link>
      </Menu.Item>


      <Menu.Item key="users">
        <Link to="/users">users</Link>
      </Menu.Item>

      <Menu.Item key="login" disabled="true">
        {user.username 
          ? <>{logoutForm()}</>
          : <>{loginForm()}</>
        }
      </Menu.Item>
    </Menu>
  )
}

export default NavBar