const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { checkAuth } = require('../middleware/checkAuth')

const User = require('../models/user')

router.get('/', checkAuth, (req, res) => {
  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET
    )
    var id = decoded.id
    User.findOne({ _id: id }, (err, user) => {
      if (err) {
        res.json({
          status: 'FAILED'
        })
      } else {
        return res.json({
          data: {
            id: user._id,
            email: user.email,
            name: user.name,
            isNewUser: user.isNewUser,
            gender: user.gender,
            birthday: user.birthday
          }
        })
      }
    })
  }
})

router.put('/updateInfo', checkAuth, (req, res) => {
  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET
    )
    var id = decoded.id
    User.findOneAndUpdate(
      { _id: id },
      {
        $set: req.body
      },
      { new: true },
      (err, user) => {
        if (err) {
          res.send(err.message)
        } else {
          return res.json({
            status: 'SUCCESS',
            message: 'Update successful',
            data: {
              id: user._id,
              email: user.email,
              name: user.name,
              isNewUser: user.isNewUser,
              gender: user.gender,
              birthday: user.birthday
            }
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
      process.env.ACCESS_TOKEN_SECRET
    )
    var id = decoded.id
    User.deleteOne({ _id: id }, (err, result) => {
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
