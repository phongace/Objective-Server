const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const TargetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    _id: Number,
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
  { _id: false },
  {
    timestamps: true
  }
)

TargetSchema.plugin(AutoIncrement)

const Target = mongoose.model('Target', TargetSchema)
module.exports = Target
