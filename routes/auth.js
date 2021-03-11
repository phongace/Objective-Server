const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { checkAuth } = require('../middleware/checkAuth')

// mongodb user model
const User = require('./../models/user')

// Password handler
const bcrypt = require('bcrypt')

router.post('/protected', checkAuth, (req, res) => {
  res.send('Inside protected route')
})

// Register
router.post('/register', (req, res) => {
  let { email, password } = req.body
  email = email.trim()
  password = password.trim()

  if (email === '' || password === '') {
    res.json({
      status: 'FAILED',
      message: 'Empty input fields!'
    })
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: 'FAILED',
      message: 'Email không hợp lệ'
    })
  } else if (password.length < 8) {
    res.json({
      status: 'FAILED',
      message: 'Mật khẩu phải có ít nhất 8 kí tự'
    })
  } else {
    // Checking if user already exists
    User.find({ email })
      .then(result => {
        if (result.length) {
          // A user already exist
          res.json({
            status: 'FAILED',
            message: 'Email đã tồn tại'
          })
        } else {
          // Try to create new user
          // password handling
          const saltRounds = 10
          bcrypt
            .hash(password, saltRounds)
            .then(hashedPass => {
              const newUser = new User({
                email,
                password: hashedPass,
                isNewUser: false
              })

              newUser
                .save()
                .then(result => {
                  res.json({
                    status: 'SUCCESS',
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
          message: 'Email đã tồn tại'
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
      message: 'Empty credentials supplied!'
    })
  } else {
    User.find({ email })
      .then(data => {
        if (data.length) {
          const hashedPass = data[0].password
          bcrypt.compare(password, hashedPass).then(result => {
            if (result) {
              let accessToken = jwt.sign(
                { email, id: data._id },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: '1h'
                }
              )
              let refreshToken = jwt.sign(
                { email },
                process.env.REFRESH_TOKEN_SECRET,
                {
                  expiresIn: '7d'
                }
              )
              res.json({
                status: 'SUCCESS',
                message: 'Login successful',
                data: {
                  accessToken,
                  refreshToken,
                  id: data[0]._id,
                  name: data[0].name,
                  email: data[0].email,
                  isNewUser: data[0].isNewUser
                }
              })
            } else {
              res.json({
                status: 'FAILED',
                message: 'Sai mật khẩu'
              })
            }
          })
        } else {
          res.json({
            status: 'FAILED',
            message: 'Sai tên đăng nhập hoặc mật khẩu'
          })
        }
      })
      .catch(err => {
        res.json({
          status: 'FAILED',
          message: 'Tài khoản không tồn tại'
        })
      })
  }
})

module.exports = router
