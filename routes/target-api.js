const express = require('express')
const router = express.Router()
const { checkAuth } = require('../middleware/checkAuth')
const Target = require('../models/target')

router.post('/', checkAuth, (req, res) => {
  var { title, description, time } = req.body
  title = title.trim()
  description = description.trim()
  time = time.trim()

  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET
    )
    var userId = decoded.id
    if (title === '' || description === '' || time === '') {
      res.json({
        status: 'FAILED',
        message: 'Empty input fields!'
      })
    } else {
      const target = new Target()
      target.id = 1
      target.userId = userId
      target.title = title
      target.description = description
      target.time = time
      target.isDone = false
      target
        .save()
        .then(result => {
          res.json({ status: 'SUCCESS', message: 'Target created!', result })
        })
        .catch(error => {
          res.json({
            status: 'FAILED',
            error
          })
        })
    }
  }
})
