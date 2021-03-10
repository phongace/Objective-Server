const express = require('express')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')
const router = express.Router()
const { checkAuth } = require('../middleware/checkAuth')

const User = require('../models/user')

router.get('/', checkAuth, (req, res) => {
  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      'access'
    )
    var email = decoded.email
    User.findOne({ email }, (err, user) => {
      if (err) {
        res.json({
          status: 'FAILED'
        })
      } else {
        return res.json(user)
      }
    })
  }
})

router.put('/updateInfo', checkAuth, (req, res) => {
  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      'access'
    )
    var email = decoded.email
    User.findOneAndUpdate(
      { email },
      {
        $set: req.body
      },
      { new: true },
      (err, result) => {
        if (err) {
          res.send(err.message)
        } else {
          return res.json({
            status: 'SUCCESS',
            message: 'Update successful',
            data: result
          })
        }
      }
    )
  }
})

router.delete('/', checkAuth, (req, res) => {
  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      'access'
    )
    var email = decoded.email
    User.deleteOne({ email }, (err, result) => {
      if (err) {
        res.send(err.message)
      } else {
        return res.json({
          status: 'SUCCESS',
          message: 'Delete successful'
        })
      }
    })
  }
})

module.exports = router
