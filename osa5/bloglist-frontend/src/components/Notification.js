import React from 'react'
import './Notification.css'

const Notification = ({ error, notice }) => {

  if (error === null && notice === null) {
    return null
  }

  const message = error || notice
  const className = error ? 'error' : 'notification'

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification
