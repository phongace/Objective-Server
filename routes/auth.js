const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

// mongodb user model
const User = require('./../models/user')

// Password handler
const bcrypt = require('bcrypt')

function auth(req, res, next) {
  let token = req.headers['authorization']
  token = token.split(' ')[1] // Access token

  jwt.verify(token, 'access', (err, user) => {
    if (!err) {
      req.user = user
      next()
    } else {
      return res.status(403).json({ message: 'User not authenticated' })
    }
  })
}

router.post('/protected', auth, (req, res) => {
  res.send('Inside protected route')
})

// Register
router.post('/register', (req, res) => {
  let { name, email, password } = req.body
  name = name.trim()
  email = email.trim()
  password = password.trim()

  if (name === '' || email === '' || password === '') {
    res.json({
      code: '-1',
      status: 'FAILED',
      message: 'Empty input fields!'
    })
  } else if (!/^[a-zA-Z]*$/.test(name)) {
    res.json({
      code: '-1',
      status: 'FAILED',
      message: 'Invalid name entered!'
    })
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      code: '-1',
      status: 'FAILED',
      message: 'Invalid email entered!'
    })
  } else if (password.length < 8) {
    res.json({
      code: '-1',
      status: 'FAILED',
      message: 'Password is too short!'
    })
  } else {
    // Checking if user already exists
    User.find({ email })
      .then(result => {
        if (result.length) {
          // A user already exist
          res.json({
            code: '-1',
            status: 'FAILED',
            message: 'User with the provided email already exists'
          })
        } else {
          // Try to create new user
          // password handling
          const saltRounds = 10
          bcrypt
            .hash(password, saltRounds)
            .then(hashedPass => {
              const newUser = new User({
                name,
                email,
                password: hashedPass
              })

              newUser
                .save()
                .then(result => {
                  res.json({
                    code: '0',
                    status: 'SUCCESS',
                    message: 'Register sucessful',
                    data: result
                  })
                })
                .catch(err => {
                  res.json({
                    code: '-1',
                    status: 'FAILED',
                    message: 'An error occurred while saving user account!'
                  })
                })
            })
            .catch(err => {
              res.json({
                code: '-1',
                status: 'FAILED',
                message: 'An error occurred while hashing password!'
              })
            })
        }
      })
      .catch(err => {
        console.log(err)
        res.json({
          code: '-1',
          status: 'FAILED',
          message: 'An error occurred while checking for existing user!'
        })
      })
  }
})

// Login
router.post('/login', (req, res) => {
  let { email, password } = req.body
  email = email.trim()
  password = password.trim()

  if (email == '' || password == '') {
    res.json({
      status: 'FAILED',
      message: 'Empty credentials supplied!'
    })
  } else {
    User.find({ email })
      .then(data => {
        if (data.length) {
          const hashedPass = data[0].password
          bcrypt
            .compare(password, hashedPass)
            .then(result => {
              if (result) {
                let accessToken = jwt.sign({ email: email }, 'access', {
                  expiresIn: '1h'
                })
                let refreshToken = jwt.sign({ email: email }, 'refresh', {
                  expiresIn: '7d'
                })
                res.json({
                  code: '0',
                  status: 'SUCCESS',
                  message: 'Login successful',
                  accessToken,
                  refreshToken,
                  data: data
                })
              } else {
                res.json({
                  code: '-1',
                  status: 'FAILED',
                  message: 'Invalid password!'
                })
              }
            })
            .catch(err => {
              res.json({
                code: '-1',
                status: 'FAILED',
                message: 'An error occurred while compating password!'
              })
            })
        } else {
          res.json({
            code: '-1',
            status: 'FAILED',
            message: 'Invalid credentials supplied!'
          })
        }
      })
      .catch(err => {
        res.json({
          code: '-1',
          status: 'FAILED',
          message: 'User not exists!'
        })
      })
  }
})

module.exports = router
