import { useState } from 'react'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { useSelector, useDispatch } from 'react-redux'
import { updateBlog } from '../redux/blogSlice'

const BlogView = ({ handleLike }) => {
  const { id } = useParams()
  const blog = useSelector(state =>
    state.blogs.find(b => b.id === id)
  )
  const dispatch = useDispatch()
  const [commentText, setCommentText] = useState('')

  if (!blog) return null

  const handleAddComment = async (event) => {
  event.preventDefault()
  if (!commentText.trim()) return
  const updatedBlog = await blogService.addComment(blog.id, commentText)
  dispatch(updateBlog(updatedBlog))
  setCommentText('')
}

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <button 
        style={{
          background: 'white',
          border: '1px solid #ccc'
        }}
        onClick={() => handleLike(blog)}>like</button>
      </div>
      <div>
        added by {blog.user && blog.user.name}
      </div>
      <h3>comments</h3>
      <form onSubmit={handleAddComment} style={{marginBottom: '10px'}}>
        <input
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Add your comment..."
          style={{
            border: '1px solid #ccc',
            borderRadius: '3px',
            padding: '2px 8px'
          }}
        />
        <button 
            type="submit"
            style={{
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '3px',
                padding: '2px 8px'
            }}
        >add comment</button>
      </form>
      <ul>
        {blog.comments && blog.comments.map((comment, i) => (
          <li key={i}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
