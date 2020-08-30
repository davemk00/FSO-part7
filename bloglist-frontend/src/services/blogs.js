import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const unsetToken = newToken => {
  token = null
}

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${ baseUrl }/${id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${ baseUrl }/${id}`, config)
  return response.data
}

const createComment = async (blogId, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${ baseUrl }/${blogId}/comments`, comment, config)
  return response.data
}

export default {
  getAll,
  create,
  update,
  setToken,
  unsetToken,
  remove,
  createComment,
}