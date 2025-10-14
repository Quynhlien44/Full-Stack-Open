const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

//3.1
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//3.2
app.get('/info', (req, res) => {
    const count = persons.length
    const date = new Date()
    res.send(
        `<div>Phonebook has info for ${count} people</div>
    <div>${date}</div>`
    )
})

//3.3
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

//3.4
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const index = persons.findIndex(p => p.id === id)
    if (index === -1) {
        return res.status(404).end()
    }
    persons.splice(index, 1)
    res.status(204).end()
})

//3.5
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body

    if (!name || !number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    const nameExists = persons.some(p => p.name === name)
    if (nameExists) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const id = (Math.floor(Math.random() * 1e10)).toString()
    const newPerson = { id, name, number }
    persons.push(newPerson)
    res.status(201).json(newPerson)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
