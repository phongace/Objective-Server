const express = require('express')
const router = express.Router()

const User = require('./../models/user')
const { auth } = require('./auth')

router.post('/updateInfo', auth, (req, res) => {
    User.findOne({ _id: req.body.id }, (err, doc) => {
        doc.name = req.body.name,
            doc.gender = req.body.gender,

            doc.save(callback)
    })
})

module.exports = router