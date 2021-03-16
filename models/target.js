const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const TargetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    id: Number,
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

TargetSchema.plugin(AutoIncrement, { inc_field: 'id' })
const Target = mongoose.model('Target', TargetSchema)

module.exports = Target
