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

  /*const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }
    await blogService.update(blog.id, updatedBlog)
    onLike(blog)
  }*/

  const canRemove = blog.user && (
    blog.user.username === currentUser.username ||
    blog.user.id === currentUser.id
  )

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-basic">
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)} className="toggle-button">
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <div className="url">{blog.url}</div>
          <div className="likes">
            likes {blog.likes}{' '}
            <button onClick={() => onLike(blog)} className="like-button">like</button>
          </div>
          <div className="user">{blog.user.name}</div>
          {canRemove && (
            <button onClick={() => onRemove(blog)} className="remove-button">remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog