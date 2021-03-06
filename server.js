const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const AuthRoute = require('./routes/auth')
const UserRoute = require('./routes/users')
const TargetRoute = require('./routes/target-api')

mongoose.connect(
  'mongodb+srv://alexnguyen:phonghoang98@cluster0.pomxs.mongodb.net/ObjectiveDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.use('/api', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/target', TargetRoute)
