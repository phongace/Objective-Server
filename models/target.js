const mongoose = require('mongoose')

const TargetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    time: String,
    isDone: Boolean,
    subTask: [
      {
        content: String
      }
    ]
  },
  {
    timestamps: true
  }
)

const Target = mongoose.model('Target', TargetSchema)

module.exports = Target
