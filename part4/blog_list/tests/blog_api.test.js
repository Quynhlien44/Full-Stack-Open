const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await mongoose.connection.collection('blogs').deleteMany({})
        await mongoose.connection.collection('blogs').insertMany([
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
