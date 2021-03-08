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

module.exports = router
