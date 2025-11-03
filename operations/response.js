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
  }
}
