const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.find({})
        res.json(blogs)
    } catch (error) {
        next(error)
    }
})

blogsRouter.post('/', async (req, res, next) => {
    try {
        const { title, author, url, likes } = req.body
        if (!title || !url) {
            return res.status(400).json({ error: 'title or url missing' })
        }
        const blog = new Blog({
            title,
            author,
            url,
            likes: likes || 0,
        })

        const savedBlog = await blog.save()
        res.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter
