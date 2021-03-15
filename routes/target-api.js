const express = require('express')
const router = express.Router()
const { checkAuth } = require('../middleware/checkAuth')

router.post('/', checkAuth, (req, res) => {
  let { title, description, time } = req.body
  title = title.trim()
  description = description.trim()
  time = time.trim()

  if (title === '' || description === '' || time === '') {
    res.json({
      status: 'FAILED',
      message: 'Empty input fields!'
    })
  } else {
  }
})
