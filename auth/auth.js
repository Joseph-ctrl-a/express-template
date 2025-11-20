const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { UserModel } = require('../db/models/user/userModel')

// Error + Response handlers
const response = require('../operations/response')
const HTTPError = require('../utils/error')

const auth = {}

auth.hashPassword = async (plainPassword, saltRounds = 10) =>
  bcrypt.hash(plainPassword, saltRounds)

auth.verifyPassword = async (plainPassword, hashedPassword) =>
  await bcrypt.compare(plainPassword, hashedPassword)

auth.buildPayLoad = userId => ({
  sub: userId,
})

auth.createJWT = function (userId) {
  return jwt.sign(this.buildPayLoad(userId), process.env.SECRET_KEY, {
    expiresIn: '15m',
  })
}

auth.findUserByEmail = async email => {
  const foundUser = await UserModel.findOne({ email })
  if (!foundUser) {
    throw new HTTPError.NotFoundError('User not found')
  }
  return foundUser
}
module.exports = { auth }
