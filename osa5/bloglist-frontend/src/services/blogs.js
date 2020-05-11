import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (payload) => {
  const config = { 
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, payload, config)
  return response.data
}

const update = async (id, payload) => {
  const response = await axios.put(`${baseUrl}/${id}`, payload)
  return response.data
}

const delete_ = async (id) => {
  const config = { 
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, delete_, setToken }