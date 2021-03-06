const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const AuthRoute = require('./routes/auth')

const uri = process.env.MONGODB_URI

mongoose.connect(
    'mongodb+srv://alexnguyen:phonghoang98@cluster0.pomxs.mongodb.net/ObjectiveDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const app = express()

app.use(cors())

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST,DELETE')
//   res.header('Access-Control-Allow-Headers', 'Content-Type')
//   next()
// })

app.use(morgan('dev'))
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/api', AuthRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})