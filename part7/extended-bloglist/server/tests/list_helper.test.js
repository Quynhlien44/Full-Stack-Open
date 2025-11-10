const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// Dummy test
test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

// Tests for total likes
describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const listWithOneBlog = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 5,
                __v: 0
            }
        ]
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const blogs = [
            { likes: 5 },
            { likes: 7 },
            { likes: 3 }
        ]
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 15)
    })
})

// Tests for favorite blog
describe('favorite blog', () => {
    test('of empty list is null', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })

    test('when list has only one blog, returns that blog', () => {
        const oneBlog = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 40,
                __v: 0
            }
        ]
        const result = listHelper.favoriteBlog(oneBlog)
        assert.deepStrictEqual(result, oneBlog[0])
    })

    test('when list has many blogs, returns the one with most likes', () => {
        const blogs = [
            { title: 'A', likes: 1 },
            { title: 'B', likes: 10 },
            { title: 'C', likes: 7 }
        ]
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, blogs[1])
    })
})

// Tests for most blogs
describe('most blogs', () => {
    test('of empty list is null', () => {
        const result = listHelper.mostBlogs([])
        assert.strictEqual(result, null)
    })

    test('when list has only one blog, returns that author with 1 blog', () => {
        const blogs = [
            {
                author: 'Edsger W. Dijkstra',
                title: 'Go To Statement Considered Harmful',
                likes: 15,
            }
        ]
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result.author, 'Edsger W. Dijkstra')
        assert.deepStrictEqual(result.blogs, 1)
    })
    test('when list has many blogs, returns the correct author with most blogs', () => {
        const blogs = [
            {
                _id: '1',
                title: 'Blog1',
                author: 'Author One',
                url: 'https://example.com/blog1',
                likes: 10,
                __v: 0
            },
            {
                _id: '2',
                title: 'Blog2',
                author: 'Author Two',
                url: 'https://example.com/blog2',
                likes: 20,
                __v: 0
            },
            {
                _id: '3',
                title: 'Blog3',
                author: 'Author One',
                url: 'https://example.com/blog3',
                likes: 30,
                __v: 0
            }
        ]
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result.author, 'Author One')
        assert.deepStrictEqual(result.blogs, 2)
    })
})

// Tests for most likes
describe('most likes', () => {
    test('of empty list is null', () => {
        const result = listHelper.mostLikes([])
        assert.strictEqual(result, null)
    })

    test('when list has only one blog, returns that author with blog likes', () => {
        const blogs = [
            {
                author: 'Author One',
                title: 'Blog1',
                likes: 5
            }
        ]
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result.author, 'Author One')
        assert.deepStrictEqual(result.likes, 5)
    })
    test('when list has many blogs, returns the correct author with most likes', () => {
        const blogs = [
            {
                _id: '1',
                title: 'Blog1',
                author: 'Author One',
                likes: 5
            },
            {
                _id: '2',
                title: 'Blog2',
                author: 'Author Two',
                likes: 10
            },
            {
                _id: '3',
                title: 'Blog3',
                author: 'Author One',
                likes: 15
            }
        ]
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result.author, 'Author One')
        assert.deepStrictEqual(result.likes, 20)
    })
})