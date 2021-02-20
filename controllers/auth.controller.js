const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const SALT_WORK_FACTOR = 10

// Register
router.post('/register', (req, res) => {})

// Login
router.post('/login', (req, res) => {})

const register = (req, res) => {
  const body = req.body
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    // if (err) return next(err)

    // hash the password using our new salt
    bcrypt.hash(body.password, salt, (err, hash) => {
      // if (err) return next(err)
      const user = new User(body)
      user
        .save()
        .then(result => {
          return res.status(200).json({ message: 'User Added Successfully!' })
        })
        .catch(error => {
          res.status(500).json({ message: 'An Error Occured!' })
        })
    })
  })
}

const login = (req, res) => {
  const body = req.body

  User.findOne({ email: body.email }, 'email password', (err, userData) => {
    if (!err) {
      const validPass = bcrypt.compare(body.password, userData.password)
      if (validPass) {
        let token = jwt.sign({ email: body.email }, 'verySecretValue', {
          expiresIn: '1h'
        })
        res.status(200).send({
          message: 'Login Successful!',
          token
        })
      } else {
        res.status(401).send({ error: 'Invalid Password' })
      }
    } else {
      res.status(401).json({ error: 'User does not exist' })
    }
  })
}

module.exports = router
