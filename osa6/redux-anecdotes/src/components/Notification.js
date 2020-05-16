import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const visible = props.notification.visible ? '' : 'none'
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: visible
  }
  return (
    <div style={style}>
      {props.notification.content}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notifications
  }
}
const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification
