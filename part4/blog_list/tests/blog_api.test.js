const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany([
            {
                title: 'Blog 1',
                author: 'Author 1',
                url: 'http://example.com/1',
                likes: 3
            },
            {
                title: 'Blog 2',
                author: 'Author 2',
                url: 'http://example.com/2',
                likes: 5
            }
        ])
    })

    test('blogs are returned as json and correct amount', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(2)
    })
})

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

    const firstBlog = response.body[0]
    expect(firstBlog.id).toBeDefined()
    expect(firstBlog._id).toBeUndefined()
})

afterAll(async () => {
    await mongoose.connection.close()
})

test('a valid blog can be added', async () => {
    const initialBlogsResponse = await api.get('/api/blogs')
    const initialBlogs = initialBlogsResponse.body

    const newBlog = {
        title: 'New blog',
        author: 'New author',
        url: 'http://newblog.com',
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAfterPostResponse = await api.get('/api/blogs')
    const blogsAfterPost = blogsAfterPostResponse.body

    expect(blogsAfterPost).toHaveLength(initialBlogs.length + 1)

    const titles = blogsAfterPost.map(b => b.title)
    expect(titles).toContain(newBlog.title)
})

test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
        title: 'No likes property blog',
        author: 'Author Test',
        url: 'http://like.com'
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
})

describe('creating a new blog', () => {
    test('fails with status 400 if title is missing', async () => {
        const newBlog = {
            author: 'Author',
            url: 'http://example.com',
            likes: 1
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('fails with status 400 if url is missing', async () => {
        const newBlog = {
            title: 'Title',
            author: 'Author',
            likes: 1
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStartResponse = await api.get('/api/blogs')
        const blogsAtStart = blogsAtStartResponse.body
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEndResponse = await api.get('/api/blogs')
        const blogsAtEnd = blogsAtEndResponse.body

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe('updating a blog', () => {
    test('succeeds in updating the likes of a blog', async () => {
        const blogsAtStart = (await api.get('/api/blogs')).body
        const blogToUpdate = blogsAtStart[0]

        const updatedData = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 10,
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.likes).toBe(blogToUpdate.likes + 10)
    })

    test('returns 404 if blog does not exist', async () => {
        const nonExistingId = '651123456789012345678901'
        await api
            .put(`/api/blogs/${nonExistingId}`)
            .send({ likes: 100 })
            .expect(404)
    })
})
