const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
    let token = ''

    beforeAll(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
        await user.save()

        const loginResponse = await api.post('/api/login').send({
            username: 'testuser',
            password: 'sekret'
        })
        token = loginResponse.body.token
    })

    beforeEach(async () => {
        await Blog.deleteMany({})
        const user = await User.findOne({ username: 'testuser' })

        const blog1 = new Blog({
            title: 'Blog 1',
            author: 'Author 1',
            url: 'http://example.com/1',
            likes: 3,
            user: user._id
        })
        const blog2 = new Blog({
            title: 'Blog 2',
            author: 'Author 2',
            url: 'http://example.com/2',
            likes: 5,
            user: user._id
        })
        await blog1.save()
        await blog2.save()
    })

    test('blogs are returned as json and correct amount', async () => {
        const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(2)
    })

    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
        const firstBlog = response.body[0]
        expect(firstBlog.id).toBeDefined()
        expect(firstBlog._id).toBeUndefined()
    })
    test('if likes property is missing, it defaults to 0', async () => {
        const newBlog = {
            title: 'No likes property blog',
            author: 'Author Test',
            url: 'http://like.com'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body.likes).toBe(0)
    })

    describe('creating a new blog', () => {
        test('succeeds with valid token', async () => {
            const newBlog = {
                title: 'Authenticated blog',
                author: 'Auth Author',
                url: 'http://authblog.com',
                likes: 10
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        })

        test('fails with status 400 if title is missing', async () => {
            const newBlog = {
                author: 'Author',
                url: 'http://example.com',
                likes: 1
            }
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
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
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = (await api.get('/api/blogs')).body
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const blogsAtEnd = (await api.get('/api/blogs')).body
            expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
            const titles = blogsAtEnd.map(blog => blog.title)
            expect(titles).not.toContain(blogToDelete.title)
        })
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
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(response.body.likes).toBe(blogToUpdate.likes + 10)
        })

        test('returns 404 if blog does not exist', async () => {
            const nonExistingId = '651123456789012345678901'
            await api
                .put(`/api/blogs/${nonExistingId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ likes: 100 })
                .expect(404)
        })
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})
