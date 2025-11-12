import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification, clearNotification } from './redux/notificationSlice'
import { setBlogs, addBlog, updateBlog, deleteBlog } from './redux/blogSlice'
import { setUser, clearUser } from './redux/userSlice'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import Navigation from './components/Navigation'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      dispatch(setBlogs(blogs))
    )
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const notify = (message, type = 'success') => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
      notify(`welcome ${user.name}`, 'success')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleCreateBlog = (blogObject) => {
    blogService.create(blogObject)
      .then(returnedBlog => {
        dispatch(addBlog(returnedBlog))
        notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
        blogFormRef.current.toggleVisibility()
      })
      .catch(() => {
        notify('create blog failed', 'error')
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
      dispatch(updateBlog({ ...returnedBlog, user: blog.user }))
    } catch {
      notify('Could not update likes', 'error')
    }
  }

  const handleRemove = (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return;
    blogService.remove(blog.id)
      .then(() => {
        dispatch(deleteBlog(blog.id))
        notify(`Deleted blog "${blog.title}"`, 'success')
      })
      .catch(() => {
        notify('Error deleting blog', 'error')
      })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogListUser')
    dispatch(clearUser())
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notification?.message} type={notification?.type} />
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
  <Router>
    <div>
      <Navigation user={user} handleLogout={handleLogout} />
      <h2>blog app</h2>
      <Notification message={notification?.message} type={notification?.type} />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={handleCreateBlog} />
              </Togglable>
              {blogs
                .slice()
                .sort((a, b) => b.likes - a.likes)
                .map(blog => (
                  <div 
                  key={blog.id}
                  style={{
                    border: '1px solid black',
                    padding: '4px 8px 0 8px',
                    margin: '4px 0'
                  }}
                  >
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title} {blog.author}
                    </Link>
                  </div>
              ))}
          </div>
          }
        />
        <Route path="/blogs/:id" element={<BlogView handleLike={handleLike} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  </Router>
)
}

export default App
