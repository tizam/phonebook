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

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(people => {
            res.json(people.map(person => person.toJSON()))
        })
        .catch(error => console.log(error))
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})

