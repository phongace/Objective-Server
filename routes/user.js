const express = require('express')
const router = express.Router()
const { default: auth } = require('./auth')


const User = require('./../models/user')

router.post('/updateInfo', auth, (req, res) => {
    User.findOne({ _id: req.body.id }, (err, doc) => {
        doc.name = req.body.name,
            doc.gender = req.body.gender,

            doc.save(callback)
    })
})