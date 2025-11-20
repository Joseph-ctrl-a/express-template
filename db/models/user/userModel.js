const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

const UserModel = mongoose.model('users', userSchema)

module.exports = { UserModel }
