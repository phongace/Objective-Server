const mongoose = require('mongoose')

const TargetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    id: { type: Number, min: 1, unique: true },
    title: { type: String, required: true },
    description: String,
    time: String,
    isDone: Boolean,
    subTask: [
      {
        idSubTask: { type: Number, min: 1, unique: true },
        content: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
)

const Target = mongoose.model('Target', TargetSchema)
module.exports = Target
