const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    id: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: String,
    gender: Boolean,
    birthday: Date,
    isNewUser: Boolean
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
module.exports = User
