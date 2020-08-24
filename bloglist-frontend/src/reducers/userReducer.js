import userService from '../services/users'
const initialState = []

const userReducer = (state = initialState, action) => {
  // console.log('state now: ', state)
  // console.log('action: ', action)

  switch (action.type) {
    case 'INIT_USERS':
      return action.data
    default:
      return state
  }
}

export const initialiseUsers = () => {
    return async (dispatch) => {
      const users = await userService.getAll()
      dispatch({
        type: 'INIT_USERS',
        data: users,
      })
    }
  }
export default userReducer