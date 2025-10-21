require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
const password = process.argv[2]
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url)

// --- ADD PERSON ---
if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({ name, number })

    person.save()
        .then(() => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })
        .catch(error => {
            console.log('Error:', error.message)
            mongoose.connection.close()
        })
}
// --- LIST ALL ---
else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    console.log('Usage:\n  node mongo.js <password> [<name> <number>]')
    mongoose.connection.close()
}
