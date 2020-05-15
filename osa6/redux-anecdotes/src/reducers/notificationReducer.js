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

export const setNotification = (content) => {
  return {
    type: 'SET_NOTICE',
    data: {
      content: content,
      visible: true
    }
  }
}

export const resetNotification = () => {
  return {
    type: 'RESET_NOTICE',
    data: initialState
  }
}

export default notificationReducer
