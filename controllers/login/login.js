const HTTPError = require('../../utils/error')
const response = require('../../operations/response')
const { auth } = require('../../auth/auth')
const { loginMethods } = require('./loginMethods')

module.exports = {
  async loginUser(req, res, next) {
    try {
      // 1. Get Email And Password
      const userInput = loginMethods.getUserInput(req)
      const { email, password } = loginMethods.getEmailAndPassword(userInput)

      // 2. Find user
      const user = await auth.findUserByEmail(email)

      // 3. Generate JWT
      const token = await loginMethods.createJWT(user, password)

      // 4. Issue JWT in secure cookie
      return response.jwt({ res, token })
    } catch (err) {
      next(err)
    }
  },
}
