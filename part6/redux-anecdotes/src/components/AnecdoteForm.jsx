import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const handleSubmit = event => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ""
        dispatch(addAnecdote(content))
        dispatch(setNotification(`You created '${content}'`, 5))
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input name="anecdote" />
            </div>
            <button type="submit">create</button>
        </form>
    )
}

export default AnecdoteForm
