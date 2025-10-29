import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onLike, onRemove, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }
    await blogService.update(blog.id, updatedBlog)
    onLike(blog)
  }

  const canRemove = blog.user && (
    blog.user.username === currentUser.username ||
    blog.user.id === currentUser.id
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name || ''}</div>
          {canRemove && (
            <button
              onClick={() => onRemove(blog)}
              style={{ backgroundColor: 'blue', color: 'white' }}
            >remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog