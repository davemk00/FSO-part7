import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

const reducers = combineReducers({
  notification: notificationReducer,
  login: loginReducer,
  blog: blogReducer,
  users: userReducer,
})

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store