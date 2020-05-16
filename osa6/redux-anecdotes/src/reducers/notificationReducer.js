const initialState = {
  content: '',
  visible: false,
  timeoutID: null
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTICE':
      state.timeoutID && clearTimeout(state.timeoutID)
      return action.data
    case 'RESET_NOTICE':
      return action.data
    default:
      return state
  }
}

export const setNotification = (content, timeout) => {
  return async dispatch => {
    const timeoutID = setTimeout(() => dispatch({
      type: 'RESET_NOTICE',
      data: initialState
    }), timeout * 1000)

    dispatch({
      type: 'SET_NOTICE',
      data: {
        content,
        visible: true,
        timeoutID
      }
    })
  }
}

export default notificationReducer
