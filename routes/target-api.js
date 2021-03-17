const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { checkAuth } = require('../middleware/checkAuth')
const Target = require('../models/target')

router.post('/', checkAuth, (req, res) => {
  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET
    )
    var userId = decoded.id

    var { title, description, time } = req.body
    title = title.trim()
    time = time.trim()

    if (title === '' || time === '') {
      res.json({
        status: 'FAILED',
        message: 'Empty input fields!'
      })
    } else {
      const target = new Target({
        userId,
        title,
        description,
        time,
        isDone: false
      })
      target
        .save()
        .then(result => {
          res.json({
            status: 'SUCCESS',
            message: 'Target created!',
            data: {
              id: result._id,
              userId: result.userId,
              title: result.title,
              description: result.description,
              time: result.time,
              isDone: result.isDone,
              subTask: result.subTask
            }
          })
        })
        .catch(error => {
          console.log(error)
          res.json({
            status: 'FAILED'
          })
        })
    }
  }
})

router.get('/', checkAuth, (req, res) => {
  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET
    )
    var userId = decoded.id
    Target.find({ userId }, (err, result) => {
      if (err) {
        res.json({
          status: 'FAILED'
        })
      } else {
        return res.json({
          status: 'SUCESS',
          data: result
        })
      }
    })
  }
})

module.exports = router
