import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notifications)
  const visible = notification.visible ? '' : 'none'
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: visible
  }
  return (
    <div style={style}>
      {notification.content}
    </div>
  )
}

export default Notification
