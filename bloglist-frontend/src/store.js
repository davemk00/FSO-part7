import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"

import notificationReducer from "./reducers/notificationReducer"
import loginReducer from "./reducers/loginReducer"

const reducers = combineReducers({
  notification: notificationReducer,
  login: loginReducer,
})

const store = createStore(
  reducers, 
  composeWithDevTools(applyMiddleware(thunk))
)

export default store;