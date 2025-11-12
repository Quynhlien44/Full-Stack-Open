import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import userService from '../services/users'

const User = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    userService.getAll().then(users => {
      setUser(users.find(u => u.id === id))
    })
  }, [id])

  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
