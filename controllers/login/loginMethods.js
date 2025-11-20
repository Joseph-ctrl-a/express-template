const { loginSchema } = require('../../validators/userSchema')
const HTTPError = require('../../utils/error')
const { auth } = require('../../auth/auth')

const loginMethods = {}

loginMethods.getUserInput = req => {
  const userInput = req.body
  if (typeof userInput !== 'object') {
    throw new HTTPError.InvalidParamTypeError(
      'userObject',
      'object',
      typeof userInput,
    )
  }
  return userInput
}
loginMethods.getEmailAndPassword = userInput => {
  const result = loginSchema.safeParse(userInput)
  if (!result.success) {
    throw new HTTPError.BadRequestError('Invalid user schema')
  }

  return result.data
}

loginMethods.createJWT = async (user, plainPassword) => {
  const isPassword = await auth.verifyPassword(plainPassword, user.password)
  if (!isPassword)
    throw new HTTPError.NotFoundError('Incorrect email or password')

  const token = auth.createJWT(user._id.toString())
  return token
}

module.exports = { loginMethods }
