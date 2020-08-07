import React from 'react'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  if (type === 'error') {
    return (
      <div className="Notification error">
        { message }
      </div>
    )
  } else {
    return (
      <div className="Notification">
        { message }
      </div>
    )
  }

}

export default Notification