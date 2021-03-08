const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: reqString,
    email: reqString,
    password: reqString,
    gender: Boolean,
    birthday: Date
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
module.exports = User
