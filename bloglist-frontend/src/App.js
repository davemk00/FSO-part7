import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch, Route
} from "react-router-dom"

import blogService from './services/blogs'
import { setUser } from './reducers/loginReducer'
import { setBlogs } from './reducers/blogReducer'
import { initialiseUsers } from './reducers/userReducer'
import UsersPage from './components/UsersPage'
import UserPage from './components/UserPage'
import BlogsPage from './components/BlogsPage'
import BlogView from './components/BlogView'
import NavBar from './components/NavBar'

import { useDispatch } from 'react-redux'

import { Layout } from 'antd';

const { Header, Content } = Layout;

const App = () => {
  
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setBlogs())
    dispatch(initialiseUsers())
  }, [dispatch])

  useEffect(() => {
    // Getting the user if already logged in
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  return (
    <Layout className="layout">
      <Router>
        <Header>
          <NavBar />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <h1>Blogs App</h1>

          <Switch>
            <Route path="/users/:id">
              <UserPage />
            </Route>
            <Route path="/blog/:id">
              <BlogView />
            </Route>
            <Route path="/users">
              <UsersPage />
            </Route>
            <Route path="/blogs">
              <BlogsPage />
            </Route>
            <Route path="/">
              <BlogsPage />
            </Route>
         </Switch>
        </Content>
      </Router>
    </Layout>
  )
}

export default App