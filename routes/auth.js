const express = require('express')
const router = express.Router()

// mongodb user model
const User = require('./../models/user')

// Password handler
const bcrypt = require('bcrypt')

// Register
router.post('/register', (req, res) => {
  let { name, email, password } = req.body
  name = name.trim()
  email = email.trim()
  password = password.trim()

  if (name === '' || email === '' || password === '') {
    res.json({
      status: 'FAILED',
      message: 'Empty input fields!'
    })
  } else if (!/^[a-zA-Z]*$/.test(name)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid name entered!'
    })
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid email entered!'
    })
  } else if (password.length < 8) {
    res.json({
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
                    status: 'SUCESS',
                    message: 'Register sucessful',
                    data: result
                  })
                })
                .catch(err => {
                  res.json({
                    status: 'FAILED',
                    message: 'An error occurred while saving user account!'
                  })
                })
            })
            .catch(err => {
              res.json({
                status: 'FAILED',
                message: 'An error occurred while hashing password!'
              })
            })
        }
      })
      .catch(err => {
        console.log(err)
        res.json({
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
                res.json({
                  status: 'SUCCESS',
                  message: 'Login successful',
                  data: data
                })
              } else {
                res.json({
                  status: 'FAILED',
                  message: 'Invalid password!'
                })
              }
            })
            .catch(err => {
              res.json({
                status: 'FAILED',
                message: 'An error occurred while compating password!'
              })
            })
        } else {
          res.json({
            status: 'FAILED',
            message: 'Invalid credentials supplied!'
          })
        }
      })
      .catch(err => {
        res.json({
          status: 'FAILED',
          message: 'User not exists!'
        })
      })
  }
})

module.exports = router
