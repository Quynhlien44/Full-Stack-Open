import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  // on first render, check localStorage for logged in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogListUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`welcome ${user.name}`)
      setNotificationType('success')
      setTimeout(() => setNotification(null), 5000)
    } catch {
      setNotification('wrong username or password')
      setNotificationType('error')
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleCreateBlog = (blogObject) => {
    blogService.create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setNotificationType('success')
        setTimeout(() => setNotification(null), 5000)
        blogFormRef.current.toggleVisibility()
      })
      .catch(() => {
        setNotification('create blog failed')
        setNotificationType('error')
        setTimeout(() => setNotification(null), 5000)
      })
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id ? blog.user.id : blog.user
    }
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === blog.id ? { ...returnedBlog, user: blog.user } : b))
    } catch {
      setNotification('Could not update likes')
      setNotificationType('error')
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleRemove = (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return;
    blogService.remove(blog.id)
      .then(() => {
        setBlogs((prevBlogs) => prevBlogs.filter(b => b.id !== blog.id))
        setNotification(`Deleted blog "${blog.title}"`)
        setNotificationType('success')
        setTimeout(() => setNotification(null), 5000)
      })
      .catch(() => {
        setNotification('Error deleting blog')
        setNotificationType('error')
        setTimeout(() => setNotification(null), 5000)
      })
  }

  // logout function
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notification} type={notificationType} />
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} type={notificationType} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            onLike={handleLike}
            onRemove={handleRemove}
            currentUser={user} />
        )}
    </div>
  )
}

export default App