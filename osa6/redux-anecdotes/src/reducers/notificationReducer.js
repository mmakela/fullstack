const initialState = {
  content: '',
  visible: false
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTICE':
      return action.data
    case 'RESET_NOTICE':
      return action.data
    default:
      return state
  }
}

export const setNotification = (content, timeout) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTICE',
      data: {
        content: content,
        visible: true
      }
    })
    setTimeout(() => dispatch({
      type: 'RESET_NOTICE',
      data: initialState
    }), timeout * 1000)
  }
}

export default notificationReducer
