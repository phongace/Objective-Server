const express = require('express')
const router = express.Router()
const { checkAuth } = require('../middleware/checkAuth')

const User = require('./../models/user')

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
  const deleted = User.find(u => u._id === id)
  if (deleted) {
    User = User.filter(u => u._id !== id)
    res.json(deleted)
  } else {
    res.json({
      status: 'FAILED',
      message: 'User you are looking for does not exist'
    })
  }
})

module.exports = router
