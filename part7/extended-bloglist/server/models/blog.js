const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
  comments: [{ type: String }]
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        const obj = {
            url: returnedObject.url,
            title: returnedObject.title,
            author: returnedObject.author,
            user: returnedObject.user,
            likes: returnedObject.likes,
            id: returnedObject.id,
            comments: returnedObject.comments
        }
        return obj
    }
})

module.exports = mongoose.model('Blog', blogSchema)
