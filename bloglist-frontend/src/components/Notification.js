import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification.message)

  if (message === null) {
    return null
  } else if (message?.type === 'error') {
      return (
        <div className="Notification error">
          { message.notification }
        </div>
      )
    } else {
      return (
        <div className="Notification">
          { message.notification }
        </div>
      )
  }
}

export default Notification