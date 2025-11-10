import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      return state.map(b => b.id === action.payload.id ? action.payload : b)
    },
    deleteBlog(state, action) {
      return state.filter(b => b.id !== action.payload)
    }
  }
})

export const { setBlogs, addBlog, updateBlog, deleteBlog } = blogSlice.actions
export default blogSlice.reducer
