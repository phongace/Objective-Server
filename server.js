const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const AuthRoute = require('./routes/auth')

const uri = process.env.MONGODB_URI

mongoose.connect(
  'mongodb+srv://alexnguyen:phonghoang98@cluster0.pomxs.mongodb.net/ObjectiveDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

app.use('/api', AuthRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
