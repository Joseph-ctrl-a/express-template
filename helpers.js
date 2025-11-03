// @ts-check
/**
 * Factory function that constructs a centralized helper object
 * for backend operations such as response formatting, error handling,
 * middleware creation, and route registration.
 *
 * Each module under `/operations` should export a factory function
 * returning an object of related methods (e.g. response ops, error ops, etc.).
 *
 * @module helpers
 */

const { DependencyError } = require('./utils/error')

// --- Core Operation Modules ---
const createErrorOps = require('./operations/error')
const createResponseOps = require('./operations/response')
const createMiddlewareOps = require('./operations/middleware')
const createRouteOps = require('./operations/route')
const createPipeOps = require('./operations/pipe')
/**
 * Creates a fully initialized helper object that bundles
 * all core backend operations into a single dependency container.
 *
 * @function helperObject
 * @returns {{
 *   response: ReturnType<typeof createResponseOps>,
 *   error: ReturnType<typeof createErrorOps>,
 *   middleware: ReturnType<typeof createMiddlewareOps>,
 *   route: ReturnType<typeof createRouteOps>
 *   pipe: ReturnType<typeof createPipeOps>
 * }}
 *
 * @throws {DependencyError} If any core operation module fails to initialize properly.
 *
 * @example
 * const { helperObject } = require('./helpers')
 * const helpers = helperObject()
 *
 * // Example usage:
 * app.use(helpers.middleware.logger())
 * app.get('/', (req, res) => helpers.response.ok({ res, data: { message: 'Hello world' } }))
 */
function helperObject() {
  // --- Core Composition ---
  const response = createResponseOps()
  const error = createErrorOps()
  const middleware = createMiddlewareOps()
  const route = createRouteOps()
  const pipe = createPipeOps()

  // --- Validation for Core Operations ---
  const modules = { response, error, middleware, route, pipe }

  for (const [key, mod] of Object.entries(modules)) {
    if (!mod || typeof mod !== 'object') {
      throw new DependencyError(
        key,
        `The "${key}" module failed to initialize correctly or did not return an object.`,
      )
    }
  }

  // --- Final Helper Object Return ---
  return modules
}

module.exports = { helperObject }
