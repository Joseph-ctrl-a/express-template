/** @typedef {Express} Express */
const cors = require('cors')

/**
 * CORS Wrapper Middleware
 *
 * Provides a preconfigured CORS (Cross-Origin Resource Sharing)
 * middleware for Express apps.
 *
 * Allows `GET`, `POST`, `PUT`, and `DELETE` methods and supports credentials.
 *
 * @module corsWrapper
 * @returns {Express.RequestHandler} Express middleware configured for CORS.
 *
 * @example
 * const express = require('express')
 * const { corsWrapper } = require('./middleware/cors')
 * const app = express()
 *
 * // Enable CORS globally
 * app.use(corsWrapper())
 *
 * // Or apply to specific routes
 * app.get('/public', corsWrapper(), (req, res) => res.send('Accessible!'))
 */
function corsWrapper() {
  return cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
}

module.exports = { corsWrapper }
