const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
        res.json(blogs)
    } catch (error) {
        next(error)
    }
})

blogsRouter.post('/', async (req, res, next) => {
    try {
        const { title, author, url, likes } = req.body
        const users = await User.find({})
        const user = users[0]

        const blog = new Blog({
            url,
            title,
            author,
            user: user._id,
            likes: likes || 0,
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
        res.status(201).json(populatedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', async (req, res, next) => {
    try {
        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', async (req, res, next) => {
    const { title, author, url, likes } = req.body
    const blog = {
        title,
        author,
        url,
        likes,
    }
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            blog,
            { new: true, runValidators: true, context: 'query' }
        )
        if (updatedBlog) {
            res.json(updatedBlog)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter
