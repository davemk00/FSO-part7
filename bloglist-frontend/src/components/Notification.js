import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'antd'


const Notification = () => {
  const message = useSelector(state => state.notification.message)

  if (message === null) {
    return null
  } else if (message?.type === 'error') {
      return (
        <Alert message={message.notification} type="error" />
      )
    } else {
      return (
        <Alert message={message.notification} type="success" />
      )
  }
}

export default Notification