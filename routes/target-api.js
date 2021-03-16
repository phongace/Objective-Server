const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { checkAuth } = require('../middleware/checkAuth')
const Target = require('../models/target')

function getSequenceNextValue(seqName) {
  var seqDoc = Target.findOneAndUpdate({
    query: { id: seqName },
    update: { $inc: { seqValue: 1 } },
    new: true
  })
  return seqDoc.seqValue
}

router.post('/', checkAuth, (req, res) => {
  var { title, description, time, contentSubTask } = req.body
  title = title.trim()
  description = description.trim()
  time = time.trim()

  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET
    )
    var userId = decoded.id
    if (title === '' || time === '') {
      res.json({
        status: 'FAILED',
        message: 'Empty input fields!'
      })
    } else {
      const target = new Target()
      target.id = getSequenceNextValue('targetId')
      target.userId = userId
      target.title = title
      target.description = description
      target.time = time
      target.isDone = false
      // target.subTask = [
      //   (target.subTask[0].idSubTask = getSequenceNextValue('subTaskId')),
      //   (target.subTask[0].content = contentSubTask)
      // ]
      target
        .save()
        .then(result => {
          res.json({
            status: 'SUCCESS',
            message: 'Target created!',
            data: {
              id: result.id,
              userId: result.userId,
              title: result.title,
              description: result.description,
              time: result.time,
              isDone: result.isDone,
              subTask: result.subTask
            }
          })
        })
        .catch(error => {
          res.json({
            status: 'FAILED',
            error
          })
        })
    }
  }
})

module.exports = router
