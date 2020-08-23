import loginService from '../services/login'

const loggedUserJSON = JSON.parse(
  window.localStorage.getItem('loggedBlogappUser')
)

const nullState = {
  id: null,
  token: null,
  username: null,
  name: null
}

const initialState = loggedUserJSON ? loggedUserJSON : nullState

const loginReducer = (state = initialState, action) => {
  // console.log('state:  ', state)
  // console.log('action: ', action)

  switch (action.type) {
    case 'LOGIN':
      return action.data
    case 'LOGOUT':
      return nullState
    default:
      return state
  }
}

export const setUser = (user) => {
  return { 
    type: 'LOGIN',
    data: user,
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({username, password})
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    dispatch({
      type: 'LOGIN',
      data: user,
    })
    return user
  }
}

export const logout = () => {
  return {
      type: 'LOGOUT'
  }
}

export default loginReducer