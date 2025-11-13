/** @typedef {Express} Express */
const { createPipeOps } = require('./pipe.js')

/**
 * Response handling utility for Express routes.
 * Provides standardized methods for sending JSON and HTTP responses.
 *
 * @module response
 * @returns {Object} Response helper methods
 */
module.exports = () => {
  const base = {
    /**
     * Sends a JSON response with optional pipeline transformation.
     *
     * @function json
     * @param {Object} options - The response options.
     * @param {Express.Response} options.res - Express response object.
     * @param {*} options.data - The data to send in the response body.
     * @param {number} [options.statusCode=200] - HTTP status code.
     * @param {boolean} [options.success=true] - Whether the response is successful.
     * @param {Function[]} [options.pipeCallBacks=[]] - Array of functions to be run in sequence (via createPipeOps) before sending response.
     * @returns {Express.Response|Object} - Express response or the result of the pipe chain.
     *
     * @example
     * // Basic JSON response
     * response.json({ res, data: users })
     *
     * @example
     * // With transformation pipeline
     * response.json({
     *   res,
     *   data: users,
     *   pipeCallBacks: [
     *     users => users.filter(u => u.active),
     *     users => users.map(u => ({ id: u.id, name: u.name }))
     *   ]
     * })
     */
    json({ res, data, statusCode = 200, success = true, pipeCallBacks = [] }) {
      if (pipeCallBacks?.length) {
        return createPipeOps().create(
          { arrayStore: data, runLast: pipeCallBacks },
          pipeData =>
            res.status(statusCode).json({ success, pipeData, statusCode }),
        )
      }
      return res.status(statusCode).json({ success, data, statusCode })
    },
  }

  return {
    ...base,

    /**
     * Sends a standard 200 OK response.
     *
     * @function ok
     * @param {Object} options - Response options.
     * @param {Express.Response} options.res - Express response object.
     * @param {*} options.data - Response data.
     * @returns {Express.Response}
     *
     * @example
     * response.ok({ res, data: user })
     */
    ok({ res, data }) {
      return base.json({ res, data, statusCode: 200 })
    },

    /**
     * Sends a standard 201 Created response.
     *
     * @function created
     * @param {Object} options - Response options.
     * @param {Express.Response} options.res - Express response object.
     * @param {*} options.data - Response data.
     * @returns {Express.Response}
     *
     * @example
     * response.created({ res, data: newUser })
     */
    created({ res, data }) {
      return base.json({ res, data, statusCode: 201 })
    },

    /**
     * Sends a 204 No Content response.
     *
     * @function noContent
     * @param {Object} options - Response options.
     * @param {Express.Response} options.res - Express response object.
     * @returns {Express.Response}
     *
     * @example
     * response.noContent({ res })
     */
    noContent({ res }) {
      return res.status(204).send()
    },

    /**
     * Sends a JWT to the client via an HTTP-only cookie.
     *
     * ⚠️ IMPORTANT:
     * This method should ONLY be used for authentication endpoints such as:
     * - User login
     * - User registration (if auto-login is desired)
     * - Token refresh
     *
     * Do NOT use this helper for regular API responses.
     * It will overwrite the JWT cookie on every call and break session handling.
     *
     * Cookie Details:
     * - httpOnly: true  → prevents JavaScript access (XSS protection)
     * - secure: true    → sends cookie only over HTTPS
     * - sameSite: strict → prevents CSRF from external sites
     * - maxAge: 3600000 → cookie expires after 1 hour
     *
     * @function jwt
     * @param {Object} options - Options for sending the JWT.
     * @param {Express.Response} options.res - Express response object.
     * @param {string} options.token - The JWT string to send.
     * @returns {Express.Response} Returns the JSON success response.
     *
     * @example
     * // In your login controller
     * const token = generateJwt(user._id)
     * response.jwt({ res, token })
     *
     * @example
     * // In your refresh token route
     * response.jwt({ res, token: newAccessToken })
     */
    jwt({ res, token }) {
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000,
      })
      return res.json({ success: true })
    },
  }
}
