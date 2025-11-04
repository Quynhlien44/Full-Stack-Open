import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    useEffect(() => {
        dispatch(initializeAnecdotes())
    }, [dispatch])

    const handleVote = async (id) => {
        await dispatch(voteAnecdote(id))
        const anecdote = anecdotes.find(a => a.id === id)
        dispatch(showNotification(`you voted '${anecdote.content}'`, 10))
    }

    const filteredAnecdotes = anecdotes.filter(a =>
        a.content.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div>
            {filteredAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes} votes
                        <button onClick={() => handleVote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList
