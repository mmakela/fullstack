const initialState = {
  content: '',
  visible: false
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET':
      return action.data
    case 'RESET':
      return action.data
  }
  return state
}

export const setNotification = (content) => {
  return {
    type: 'SET',
    data: {
      content: content,
      visible: true
    }
  }
}

export const resetNotification = () => {
  return {
    type: 'RESET',
    data: initialState
  }
}

export default notificationReducer
