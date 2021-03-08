const express = require('express')
const router = express.Router()

const User = require('./../models/user')
const { checkAuth } = require('./auth')

router.put('/updateInfo/:id', checkAuth, (req, res) => {
  const { id } = req.params
  //   const { name, gender, birthday } = req.body
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
        return res.send(result)
      }
    }
  )
})
