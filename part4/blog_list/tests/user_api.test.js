const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    await api.post('/api/users').send({ username: 'uniqueuser', name: 'Test', password: 'secret' })
})

test('fails with 400 if username is missing', async () => {
    const result = await api.post('/api/users').send({ name: 'NoUsername', password: 'secret' })
    expect(result.status).toBe(400)
    expect(result.body.error).toContain('username and password required')
})

test('fails with 400 if password is missing', async () => {
    const result = await api.post('/api/users').send({ username: 'test', name: 'NoPass' })
    expect(result.status).toBe(400)
    expect(result.body.error).toContain('username and password required')
})

test('fails if username or password <3 chars', async () => {
    let result = await api.post('/api/users').send({ username: 'ab', name: 'short', password: '1234' })
    expect(result.status).toBe(400)
    expect(result.body.error).toContain('at least 3 characters')
    result = await api.post('/api/users').send({ username: 'abc', password: 'xx' })
    expect(result.status).toBe(400)
    expect(result.body.error).toContain('at least 3 characters')
})

test('fails if username is not unique', async () => {
    const result = await api.post('/api/users').send({ username: 'uniqueuser', name: 'Duplicate', password: 'secret' })
    expect(result.status).toBe(400)
    expect(result.body.error).toContain('unique')
})

afterAll(async () => {
    await mongoose.connection.close()
})
