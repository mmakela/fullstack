const reducer = (state = [], action) => {
  let result

  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'VOTE':
      result = state.map(item => item.id === action.data ? { ...item, votes: item.votes + 1 } : item)
      break
    case 'NEW_ANECDOTE':
      result = [...state, action.data]
      break
    case 'INIT_ANECDOTES':
      result = action.data
      break
    default:
      return state
  }
  result.sort((a, b) => b.votes - a.votes)
  return result
}

export const vote = (id) => {
  return {
    type: 'VOTE',
    data: id
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'NEW_ANECDOTE',
    data: content
  }
}

export const initializeAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes
  }
}

export default reducer
