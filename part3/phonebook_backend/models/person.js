const mongoose = require('mongoose')

const phoneValidator = [
    {
        validator: function (v) {
            if (!v) return false
            if (v.length < 8) return false
            if (!/^[0-9]{2,3}-[0-9]+$/.test(v)) return false
            return true
        },
        message: props => `${props.value} is not a valid phone number! Format must be 09-1234556 or 040-22334455`
    }
]

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        validate: phoneValidator,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
