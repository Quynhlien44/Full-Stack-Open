const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
        response.json(blogs)
    } catch (error) {
        next(error)
    }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    try {
        /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }*/
        const token = request.token
        if (!token) {
            return response.status(401).json({ error: 'token missing' })
        }
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        const user = await User.findById(decodedToken.id)
        //const user = request.user
        const { title, author, url, likes } = request.body
        if (!title || !url) {
            return response.status(400).json({ error: 'title or url missing' })
        }
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
        response.status(201).json(populatedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    try {
        /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }*/

        const user = request.user
        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }
        if (blog.user.toString() !== user._id.toString()) {
            return response.status(401).json({ error: 'only the creator can delete the blog' })
        }
        await Blog.findByIdAndDelete(request.params.id)
        user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
        await user.save()
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {
    const { title, author, url, likes } = request.body
    const blog = {
        title,
        author,
        url,
        likes,
    }
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            blog,
            { new: true, runValidators: true, context: 'query' }
        )
        if (updatedBlog) {
            response.json(updatedBlog)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter
