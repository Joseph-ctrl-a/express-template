/** @typedef {Express} Express */
// --- ERROR HANDLING ---

/**
 * Error Handling Factory
 *
 * Provides a consistent and centralized way to generate, log,
 * and throw HTTP and custom API errors in an Express app.
 *
 * @module errorFactory
 * @returns {Object} Error handling utilities
 *
 * @example
 * const error = require('./error')()
 *
 * // Create an error object
 * const notFound = error.NotFound('User not found')
 *
 * // Throw directly in a route
 * app.get('/users/:id', (req, res) => {
 *   const user = null
 *   if (!user) return error.throwNotFound(res)
 * })
 *
 * // Custom error logging
 * error.log(new Error('Something went wrong'), 'UserController')
 */

/**
 * Creates a standardized error object.
 *
 * @private
 * @function base
 * @param {Object} param0 - Error details.
 * @param {string} param0.message - Human-readable error message.
 * @param {number} param0.statusCode - HTTP status code.
 * @param {string} param0.errorType - Type or classification of the error.
 * @returns {Object} Error object.
 */
const base = ({ message, statusCode, errorType }) => ({
  success: false,
  message,
  statusCode,
  errorType,
})

/**
 * Sends a JSON response containing the error.
 *
 * @private
 * @function send
 * @param {Express.Response} res - Express response object.
 * @param {Object} err - Error object created via `base()`.
 * @returns {Express.Response}
 */
const send = (res, err) => res.status(err.statusCode).json(err)

module.exports = {
  // ==============================================================
  // Tier 1: Core utilities
  // ==============================================================

  /**
   * Throws an error by sending it as an HTTP response.
   *
   * @function throw
   * @param {Express.Response} res - Express response object.
   * @param {Object} errObj - Error object created via a Tier 2 method.
   * @returns {void}
   *
   * @example
   * error.throw(res, error.BadRequest('Missing required field'))
   */
  throw(res, errObj) {
    send(res, errObj)
  },

  /**
   * Creates a custom error object.
   *
   * @function create
   * @param {Object} config - Configuration object.
   * @param {string} config.message - Error message.
   * @param {number} config.statusCode - HTTP status code.
   * @param {string} config.errorType - Logical error name.
   * @returns {Object} Error object.
   */
  create: base,

  /**
   * Logs an error with contextual information and timestamp.
   *
   * @function log
   * @param {Error} err - Error to log.
   * @param {string} [context=''] - Optional context (e.g., module name or function).
   * @returns {void}
   *
   * @example
   * error.log(err, 'AuthController')
   */
  log(err, context = '') {
    console.error(`[${new Date().toISOString()}] ${context}`, err)
  },

  // ==============================================================
  // Tier 2: Common API errors (object factories)
  // ==============================================================

  /**
   * 400 Bad Request error.
   * @function BadRequest
   * @param {string} [message='Bad Request']
   * @returns {Object}
   */
  BadRequest(message = 'Bad Request') {
    return base({ message, statusCode: 400, errorType: 'BadRequest' })
  },

  /**
   * 401 Unauthorized error.
   * @function Unauthorized
   * @param {string} [message='Unauthorized']
   * @returns {Object}
   */
  Unauthorized(message = 'Unauthorized') {
    return base({ message, statusCode: 401, errorType: 'Unauthorized' })
  },

  /**
   * 403 Forbidden error.
   * @function Forbidden
   * @param {string} [message='Forbidden']
   * @returns {Object}
   */
  Forbidden(message = 'Forbidden') {
    return base({ message, statusCode: 403, errorType: 'Forbidden' })
  },

  /**
   * 404 Not Found error.
   * @function NotFound
   * @param {string} [message='Resource not found']
   * @returns {Object}
   */
  NotFound(message = 'Resource not found') {
    return base({ message, statusCode: 404, errorType: 'NotFound' })
  },

  /**
   * 409 Conflict error.
   * @function Conflict
   * @param {string} [message='Conflict']
   * @returns {Object}
   */
  Conflict(message = 'Conflict') {
    return base({ message, statusCode: 409, errorType: 'Conflict' })
  },

  /**
   * 422 Validation error.
   * @function Validation
   * @param {string} [message='Invalid input']
   * @returns {Object}
   */
  Validation(message = 'Invalid input') {
    return base({ message, statusCode: 422, errorType: 'ValidationError' })
  },

  /**
   * 500 Internal Server Error.
   * @function Server
   * @param {string} [message='Internal Server Error']
   * @returns {Object}
   */
  Server(message = 'Internal Server Error') {
    return base({ message, statusCode: 500, errorType: 'ServerError' })
  },

  // ==============================================================
  // Tier 3: Throw Variants (send + create)
  // ==============================================================

  /**
   * Sends a 400 Bad Request response.
   * @function throwBadRequest
   * @param {Express.Response} res
   * @param {string} [message='Bad Request']
   */
  throwBadRequest(res, message = 'Bad Request') {
    return this.throw(res, this.BadRequest(message))
  },

  /**
   * Sends a 401 Unauthorized response.
   * @function throwUnauthorized
   * @param {Express.Response} res
   * @param {string} [message='Unauthorized']
   */
  throwUnauthorized(res, message = 'Unauthorized') {
    return this.throw(res, this.Unauthorized(message))
  },

  /**
   * Sends a 403 Forbidden response.
   * @function throwForbidden
   * @param {Express.Response} res
   * @param {string} [message='Forbidden']
   */
  throwForbidden(res, message = 'Forbidden') {
    return this.throw(res, this.Forbidden(message))
  },

  /**
   * Sends a 404 Not Found response.
   * @function throwNotFound
   * @param {Express.Response} res
   * @param {string} [message='Resource not found']
   */
  throwNotFound(res, message = 'Resource not found') {
    return this.throw(res, this.NotFound(message))
  },

  /**
   * Sends a 409 Conflict response.
   * @function throwConflict
   * @param {Express.Response} res
   * @param {string} [message='Conflict']
   */
  throwConflict(res, message = 'Conflict') {
    return this.throw(res, this.Conflict(message))
  },

  /**
   * Sends a 422 Validation Error response.
   * @function throwValidation
   * @param {Express.Response} res
   * @param {string} [message='Invalid input']
   */
  throwValidation(res, message = 'Invalid input') {
    return this.throw(res, this.Validation(message))
  },

  /**
   * Sends a 500 Internal Server Error response.
   * @function throwServer
   * @param {Express.Response} res
   * @param {string} [message='Internal Server Error']
   */
  throwServer(res, message = 'Internal Server Error') {
    return this.throw(res, this.Server(message))
  },

  /**
   * Sends a custom error response for dynamic or unknown errors.
   *
   * @function throwCustom
   * @param {Express.Response} res
   * @param {Object} err - Custom error object.
   * @param {string} [err.message='Unknown Error']
   * @param {number} [err.statusCode=500]
   * @param {string} [err.errorType='Unhandled Error']
   * @returns {void}
   *
   * @example
   * try {
   *   throw new Error('Database timeout')
   * } catch (err) {
   *   error.throwCustom(res, { message: err.message, statusCode: 503, errorType: 'DatabaseError' })
   * }
   */
  throwCustom(res, err) {
    const message = err.message || 'Unknown Error'
    const statusCode = err.statusCode || 500
    const errorType = err.errorType || 'Unhandled Error'
    return this.throw(res, base({ message, statusCode, errorType }))
  },
}
