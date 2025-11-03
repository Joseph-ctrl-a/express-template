/** @typedef {Express} Express */
const middleware = require('../operations/middleware')()

/**
 * Global Middleware Loader
 *
 * Applies all global middleware (JSON parser, URL-encoded parser,
 * CORS, and logger) to the provided Express application instance.
 *
 * @module loadGlobalMiddleware
 * @param {Express.Express} app - The Express application instance.
 * @returns {void}
 *
 * @example
 * const express = require('express')
 * const app = express()
 * const loadGlobalMiddleware = require('./loaders/global')
 *
 * // Apply all core middlewares
 * loadGlobalMiddleware(app)
 *
 * // Start the server
 * app.listen(5000, () => console.log('Server running on port 5000'))
 */
module.exports = app => {
  app.use([
    middleware.json(),
    middleware.logger(),
    middleware.urlencoded(),
    middleware.cors(),
  ])
}
