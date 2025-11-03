import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        const filter = state.filter
        return state.anecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
    })
    const dispatch = useDispatch()

    const sortedAnecdotes = anecdotes.slice().sort((a, b) => b.votes - a.votes)

    const handleVote = (anecdote) => {
        dispatch(voteAnecdote(anecdote.id))
        dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
    }

    return (
        <div>
            {sortedAnecdotes.map(anecdote => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList
