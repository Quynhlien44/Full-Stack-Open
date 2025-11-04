import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import React, { useContext } from 'react' // Thêm dòng này!
import { getAnecdotes, voteAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext, { showNotification } from './NotificationContext'

const App = () => {
  const [, dispatchNotification] = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (updatedAnec) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map(a =>
          a.id !== updatedAnec.id ? a : updatedAnec
        )
      )
    },
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return <div>{result.error.message}</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote)
    showNotification(dispatchNotification, `anecdote '${anecdote.content}' voted`)
  }

  return (
    <div>
      <h2>Anecdote app</h2>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map((anecdote) => (
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

export default App