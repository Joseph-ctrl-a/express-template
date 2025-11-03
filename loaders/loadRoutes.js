/** @typedef {Express} Express */
const fs = require('fs')
const path = require('path')

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
module.exports = async (app, helpers) => {
  const routesDir = path.join(__dirname, '..', 'routes')

  // Read all route files
  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'))

  for (const file of files) {
    const routePath = path.join(routesDir, file)
    const routeName = `/${path.basename(file, '.js')}`

    try {
      // Import the route module
      const routeModule = require(routePath)

      // Route modules should export a function that takes helpers and returns a router
      const router =
        typeof routeModule === 'function' ? routeModule(helpers) : routeModule

      app.use(routeName, router)
      console.log(`✅ Route loaded: ${routeName}`)
    } catch (err) {
      console.error(`❌ Failed to load route: ${file}\n`, err)
    }
  }
}
