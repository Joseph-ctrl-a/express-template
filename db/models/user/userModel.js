const mongoose = require('mongoose')
function createUserSchema() {
  return {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  }
}
const userSchema = new mongoose.Schema(createUserSchema())

const User = mongoose.model('users', userSchema)

module.exports = { User }
