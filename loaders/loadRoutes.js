/** @typedef {Express} Express */
const fs = require('fs')
const path = require('path')
const login = require('../routes/login')

/**
 * Dynamically loads and registers all route modules in the `routes` directory.
 *
 * Each route module must export a function that accepts the shared `helpers`
 * object and returns an Express Router instance.
 *
 * @module loadRoutes
 * @param {Express.Express} app - The main Express application instance.
 * @param {Object} helpers - Dependency container providing shared modules (error, response, db models, etc.).
 * @returns {Promise<void>} Resolves once all route modules are registered.
 *
 * @example
 * const express = require('express')
 * const app = express()
 * const loadRoutes = require('./loadRoutes')
 * const helpers = require('./operations/helpers')()
 *
 * (async () => {
 *   await loadRoutes(app, helpers)
 *   app.listen(5000, () => console.log('Server running on port 5000'))
 * })()
 */
module.exports = app => {
  const loginRouter = require('../routes/login')
  app.use('/login', loginRouter())
}
