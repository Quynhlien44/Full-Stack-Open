import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
    refetch
  } = useQuery(ALL_BOOKS, {
    variables: { author: null, genre: selectedGenre }
  })

  const allGenresResult = useQuery(ALL_BOOKS, {
    variables: { author: null, genre: null }
  })


  if (!props.show) return null
  if (booksLoading || allGenresResult.loading)
    return <div>loading...</div>

  if (booksError)
    return <div>Error: {booksResult.error.message}</div>

  const books = booksData?.allBooks || []
  const allBooks = allGenresResult.data?.allBooks || []

  const genres = [
    ...new Set(allBooks.flatMap(book => book.genres))
  ]

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && (
        <div>
          in genre <b>{selectedGenre}</b>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => {
              setSelectedGenre(genre)
              refetch({ author: null, genre })
            }}
          >
            {genre}
          </button>
        ))}

        <button onClick={() => {
                  setSelectedGenre(null)
                  refetch({ author: null, genre: null })
                }}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books