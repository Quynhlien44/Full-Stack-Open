const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav), blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const count = {}
    blogs.forEach(blog => {
        count[blog.author] = (count[blog.author] || 0) + 1
    })

    let maxAuthor = null
    let maxBlogs = 0
    for (const author in count) {
        if (count[author] > maxBlogs) {
            maxBlogs = count[author]
            maxAuthor = author
        }
    }

    return { author: maxAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const likeCount = {}
    blogs.forEach(blog => {
        likeCount[blog.author] = (likeCount[blog.author] || 0) + blog.likes
    })

    let maxAuthor = null
    let maxLikes = 0
    for (const author in likeCount) {
        if (likeCount[author] > maxLikes) {
            maxLikes = likeCount[author]
            maxAuthor = author
        }
    }

    return { author: maxAuthor, likes: maxLikes }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}
