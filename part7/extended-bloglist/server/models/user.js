const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        const obj = {
            blogs: returnedObject.blogs,
            username: returnedObject.username,
            name: returnedObject.name,
            id: returnedObject.id
        }
        return obj
    },
})

module.exports = mongoose.model('User', userSchema)
