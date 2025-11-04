import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = () => {
    return axios.get(baseUrl).then(res => res.data)
}

export const createNew = (content) => {
    return axios.post(baseUrl, { content, votes: 0 }).then(res => res.data)
}

export const updateVotes = (id, updatedAnecdote) => {
    return axios.put(`${baseUrl}/${id}`, updatedAnecdote).then(res => res.data)
}
