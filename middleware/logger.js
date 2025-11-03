/** @typedef {Express} Express */
/**
 * Express Request Logger Middleware
 *
 * Provides a configurable logging middleware that prints
 * HTTP method, route, and timestamp for each incoming request.
 *
 * @module logger
 * @param {Object} [options={}] - Configuration options.
 * @param {boolean} [options.showTime=true] - Whether to include an ISO timestamp in the log output.
 * @param {string} [options.prefix='[LOG]'] - Custom prefix label for each log entry.
 * @returns {Express.RequestHandler} Express middleware function.
 *
 * @example
 * const express = require('express')
 * const { logger } = require('./middleware/logger')
 * const app = express()
 *
 * // Basic usage
 * app.use(logger())
 *
 * // Custom prefix and without timestamps
 * app.use(logger({ prefix: '[REQUEST]', showTime: false }))
 *
 * app.get('/', (req, res) => res.send('Home'))
 */
function logger({ showTime = true, prefix = '[LOG]' } = {}) {
  return (req, res, next) => {
    const { method, url } = req
    const logParts = [prefix, method, url]

    if (showTime) {
      logParts.push(`Time: ${new Date().toISOString()}`)
    }

    console.log(logParts.join(' | '))
    next()
  }
}

module.exports = { logger }
