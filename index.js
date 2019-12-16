require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const Person = require('./model/person')
const PORT = process.env.PORT || 3001

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(result => {
            res.json(result)
        })
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})

