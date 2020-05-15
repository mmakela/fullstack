const filterReducer = (state = '', action) => {
  if (action.type === 'SET_FILTER') {
    return action.data
  }
  return state
}

export const setFilter = (value) => {
  return {
    'type': 'SET_FILTER',
    'data': value.toLowerCase()
  }
}

export default filterReducer
