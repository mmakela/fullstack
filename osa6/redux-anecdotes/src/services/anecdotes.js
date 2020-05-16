import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const updateVote = async (id) => {
  const url = `${baseUrl}/${id}`
  let response = await axios.get(url)
  const object = response.data
  response = await axios.put(url, { ...object, votes: object.votes + 1 })
  return response.data
}

export default { getAll, createNew, updateVote }
