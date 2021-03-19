const mongoose = require('mongoose')

const TargetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    time: ['Ngày', 'Tuần', 'Tháng', 'Năm'],
    isDone: Boolean,
    isPriority: Boolean,
    subTask: [
      // {
      //   idSubTask: { type: Number, unique: true },
      //   content: { type: String, required: true }
      // }
    ]
  },
  {
    timestamps: true
  }
)

const Target = mongoose.model('Target', TargetSchema)
module.exports = Target
