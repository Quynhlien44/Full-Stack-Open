import { useSubscription, useApolloClient } from '@apollo/client/react'
import { useState, useEffect } from 'react'
import { BOOK_ADDED, ALL_BOOKS } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const uniqById = (books) => {
    const seen = new Set()
    return books.filter((item) => {
      const duplicate = seen.has(item.id)
      seen.add(item.id)
      return !duplicate
    })
  }

  const updateCache = (addedBook) => {

    client.cache.updateQuery(
      { query: ALL_BOOKS, variables: { author: null, genre: null } },
      (data) => {
        if (!data) return
        return {
          allBooks: uniqById(data.allBooks.concat(addedBook))
        }
      }
    )

    addedBook.genres.forEach((genre) => {
      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { author: null, genre } },
        (data) => {
          if (!data) return
          return {
            allBooks: uniqById(data.allBooks.concat(addedBook))
          }
        }
      )
    })
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book added: ${addedBook.title}`)
      updateCache(addedBook)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {!token && (
          <button onClick={() => setPage('login')}>login</button>
        )}

        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Login show={page === 'login'} setToken={setToken} />
      <Recommend show={page === 'recommend'} />
    </div>
  )
}

export default App