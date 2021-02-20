const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const AuthRoute = require('./routes/auth')

mongoose.connect('mongodb://localhost:27017/objective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send('Hello Phong')
})

app.use('/api', AuthRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})