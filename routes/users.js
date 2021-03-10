const express = require('express')
const router = express.Router()
const { checkAuth } = require('../middleware/checkAuth')

const User = require('../models/user')

router.get('/userInfo', checkAuth, (req, res) => {
  const { email } = req.body
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.json({
        status: 'FAILED'
      })
      throw err
    }
    res.json(user)
  })
})

router.put('/updateInfo/:id', checkAuth, (req, res) => {
  const { id } = req.params
  User.findOneAndUpdate(
    { _id: id },
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
})

router.delete('/delete/:id', checkAuth, (req, res) => {
  const { id } = req.params
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
})

module.exports = router
