import { useQuery } from '@apollo/client/react'
import { ME, ALL_BOOKS } from '../queries'

const Recommend = ({ show }) => {
  const { data: userData, loading: userLoading } = useQuery(ME)

  const favoriteGenre = userData?.me?.favoriteGenre

  const {
    data: booksData,
    loading: booksLoading
  } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre
  })

  if (!show) return null
  if (userLoading || booksLoading) return <div>loading...</div>

  const books = booksData?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>

      <div>
        books in your favorite genre <b>{favoriteGenre}</b>
      </div>

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
    </div>
  )
}

export default Recommend