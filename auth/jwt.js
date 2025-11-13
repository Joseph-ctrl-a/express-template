require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { user } = require('../validators/userSchema')
const { User } = require('../db/models/user/userModel')

// Error + Response handlers
const response = require('../operations/response')
const HTTPError = require('../utils/error')

/* ----------------------------------------------------------
   PASSWORD HELPERS
---------------------------------------------------------- */

/**
 * Hashes a plain-text password using bcrypt.
 *
 * @async
 * @function hashPassword
 * @param {string} plainPassword - The raw user password to hash.
 * @returns {Promise<string>} A bcrypt-hashed version of the password.
 *
 * @example
 * const hash = await hashPassword("myPassword123");
 */
async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10)
}

/**
 * Verifies a plain password against a stored bcrypt hash.
 *
 * @async
 * @function verifyPassword
 * @param {string} plainPassword - The password provided by the user.
 * @param {string} hashedPassword - The stored hashed password.
 * @returns {Promise<boolean>} Whether the passwords match.
 *
 * @example
 * const isValid = await verifyPassword("myPassword123", user.password);
 */
async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword)
}

/* ----------------------------------------------------------
   JWT HELPERS
---------------------------------------------------------- */

/**
 * Builds the JWT payload.
 * Only stores immutable data: the user's ID.
 *
 * @function buildPayload
 * @param {string} userId - The user's MongoDB ObjectId (stringified).
 * @returns {{ sub: string }} The JWT payload object.
 *
 * @example
 * const payload = buildPayload("65fa...");
 */
function buildPayload(userId) {
  return { sub: userId }
}

/**
 * Creates and signs a short-lived JWT token.
 *
 * @function createJWT
 * @param {string} userId - The user ID to embed into the token payload.
 * @returns {string} A signed JWT.
 *
 * @example
 * const token = createJWT("65fa...");
 */
function createJWT(userId) {
  const payload = buildPayload(userId)
  const secret = process.env.SECRET_KEY

  return jwt.sign(payload, secret, {
    expiresIn: '15m',
  })
}

/* ----------------------------------------------------------
   LOGIN HANDLER
---------------------------------------------------------- */

/**
 * Handles user login by:
 * 1. Validating input structure with Zod
 * 2. Fetching user by email
 * 3. Verifying password
 * 4. Issuing JWT inside an HTTP-only cookie
 *
 * Expected `req.body`:
 * {
 *   "email": "user@example.com",
 *   "password": "myPassword123"
 * }
 *
 * ⚠ IMPORTANT:
 * This function must be used inside an Express route
 * and depends on your global error-handling middleware.
 *
 * @async
 * @function handleLogin
 * @param {Express.Request} req - The incoming login request.
 * @param {Express.Response} res - The response object.
 * @param {Function} next - Express `next` function for error forwarding.
 * @returns {Promise<Express.Response>} Sends a JWT cookie + success JSON.
 *
 * @throws {HTTPError.InvalidParamTypeError} If req.body is not an object.
 * @throws {HTTPError.BadRequestError} If schema validation fails.
 * @throws {HTTPError.NotFoundError} If no matching user is found.
 * @throws {HTTPError.BadRequestError} If password is incorrect.
 *
 * @example
 * app.post("/login", handleLogin);
 */
async function handleLogin(req, res, next) {
  try {
    const userInput = req.body

    // 1. Validate raw object type
    if (typeof userInput !== 'object') {
      throw new HTTPError.InvalidParamTypeError(
        'userObject',
        'object',
        typeof userInput,
      )
    }

    // 2. Validate structure with Zod
    const result = user.safeParse(userInput)
    if (!result.success) {
      throw new HTTPError.BadRequestError('Invalid user schema')
    }

    const { email, password } = result.data

    // 3. Find user
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
      throw new HTTPError.NotFoundError('User not found')
    }

    // 4. Verify password
    const passwordMatches = await verifyPassword(password, foundUser.password)
    if (!passwordMatches) {
      throw new HTTPError.BadRequestError('Incorrect email or password')
    }

    // 5. Issue JWT in secure cookie
    const token = createJWT(foundUser._id.toString())

    return response.jwt({ res, token })
  } catch (err) {
    next(err)
  }
}

/* ---------------------------------------------------------- */

module.exports = {
  handleLogin,
  hashPassword,
  verifyPassword,
  createJWT,
  buildPayload,
}
