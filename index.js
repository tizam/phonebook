require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./model/person')
const PORT = process.env.PORT || 3001

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('build'))

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :body'
    )
)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/info', (req, res) => {
    Person.estimatedDocumentCount({}, (error, c) => {
        if (error) throw new Error({ error: error.message })

        res.send(`<p>phonebook has info for ${c} people</p>
            <p>${new Date()}</p>
        `)
    })
})

/**
 * get all persons
 */
app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(people => {
            res.json(people.map(person => person.toJSON()))
        })
        .catch(error => console.log(error))
})

/**
 * get single person
 */
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => res.json(person.toJSON()))
        .catch(error => next(error))
})

/**
 * delete single person
 */
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            console.log(`deleted`)
            res.status(204).end()
        })
        .catch(error => next(error))
})

/**
 * add a person
 */
app.post('/api/persons/', (req, res, next) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({ error: 'name and number are required' })
    }

    const person = new Person({
        name: req.body.name,
        number: req.body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
        .catch(error => next(error))
})

/**
 * update person
 */
app.put('/api/persons/:id', (req, res, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

/**
 * unknownEndpoint middleware
 */
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

/**
 * error handler
 */
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

/**
 * run server
 */
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})

