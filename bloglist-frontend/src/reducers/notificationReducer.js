const initialState = {
  message: null,
  type: null,
}

const notificationReducer = (state = initialState, action) => {
  // console.log('notification state now: ', state)
  // console.log('notification action: ', action)
  
  switch (action.type) {
    case 'SET_NOTIFICATION':
      const msg = action.notification.message
      clearTimeout(state.duration)
      state = {
        message: msg,
      }
      return state

    case 'CLEAR_NOTIFICATION':
      state = initialState
      return state

    default:
      return state
  }
}

var timeoutID

export const setNotification = (message, type) => {
  clearTimeout(timeoutID)
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification: {
        message,
        type,
      }
    })
  }
}

export const clearNotification = () => {
  return {
      type: 'CLEAR_NOTIFICATION'
  }
}


export default notificationReducer