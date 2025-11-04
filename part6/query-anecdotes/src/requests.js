const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('anecdote service not available due to problems in server')
    }
    return await response.json()
}

export const createAnecdote = async (content) => {
    const newAnecdote = { content, votes: 0 }
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnecdote)
    })
    if (!response.ok) {
        const errorObj = await response.json()
        throw new Error(errorObj.error || 'Failed to create anecdote')
    } else {
        const errorMsg = await response.text()
        throw new Error(errorMsg || 'Failed to create anecdote')
    }
}

export const voteAnecdote = async (anecdote) => {
    const updatedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
    }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAnecdote),
    })
    if (!response.ok) {
        throw new Error('Failed to vote for anecdote')
    }
    return await response.json()
}
