/** @typedef {Express} Express */
/**
 * Express Router Factory
 *
 * Provides a wrapper around Express Router to simplify
 * route definition and maintain a consistent handler pattern.
 *
 * @module routeFactory
 * @returns {Object} API object containing route helpers and the router instance.
 *
 * @example
 * const route = require('./routeFactory')()
 *
 * route.get('/users', (req, res) => res.send('All users'))
 * route.post('/users', (req, res) => res.send('Created user'))
 *
 * module.exports = route.router
 */
module.exports = () => {
  const express = require('express')
  const router = express.Router()

  /**
   * Wraps a route handler to ensure consistent argument structure.
   *
   * @private
   * @function makeHandler
   * @param {Function} handler - The request handler (req, res, next) => {}.
   * @returns {Function} Wrapped handler function.
   */
  const makeHandler = handler => (req, res, next) => handler(req, res, next)

  /**
   * Router API containing HTTP method helpers.
   *
   * @namespace api
   * @property {Function} route - Generic route definition method.
   * @property {Function} get - Defines a GET route.
   * @property {Function} post - Defines a POST route.
   * @property {Function} put - Defines a PUT route.
   * @property {Function} patch - Defines a PATCH route.
   * @property {Function} delete - Defines a DELETE route.
   * @property {Function} use - Applies middleware.
   * @property {Express.Router} router - The Express router instance.
   */
  const api = {
    /**
     * Defines a route with a given HTTP method and handler.
     *
     * @function route
     * @memberof api
     * @param {'get'|'post'|'put'|'patch'|'delete'} [method='get'] - HTTP method.
     * @param {string} [path='/'] - Route path.
     * @param {Function} handler - Express route handler (req, res, next) => {}.
     * @returns {Express.Router} The Express router instance.
     * @throws {Error} If handler is not provided.
     *
     * @example
     * api.route('post', '/login', (req, res) => res.send('Logging in'))
     */
    route(method = 'get', path = '/', handler) {
      if (!handler) throw new Error('incorrect params')
      return router[method](path, makeHandler(handler))
    },

    /**
     * Registers a GET route.
     * @function get
     * @memberof api
     * @param {string} path - Route path.
     * @param {Function} handler - Express route handler.
     * @returns {Express.Router}
     */
    get(path, handler) {
      return api.route('get', path, handler)
    },

    /**
     * Registers a POST route.
     * @function post
     * @memberof api
     * @param {string} path - Route path.
     * @param {Function} handler - Express route handler.
     * @returns {Express.Router}
     */
    post(path, handler) {
      return api.route('post', path, handler)
    },

    /**
     * Registers a PUT route.
     * @function put
     * @memberof api
     * @param {string} path - Route path.
     * @param {Function} handler - Express route handler.
     * @returns {Express.Router}
     */
    put(path, handler) {
      return api.route('put', path, handler)
    },

    /**
     * Registers a PATCH route.
     * @function patch
     * @memberof api
     * @param {string} path - Route path.
     * @param {Function} handler - Express route handler.
     * @returns {Express.Router}
     */
    patch(path, handler) {
      return api.route('patch', path, handler)
    },

    /**
     * Registers a DELETE route.
     * @function delete
     * @memberof api
     * @param {string} path - Route path.
     * @param {Function} handler - Express route handler.
     * @returns {Express.Router}
     */
    delete(path, handler) {
      return api.route('delete', path, handler)
    },

    /**
     * Applies middleware or other routers to this router.
     * @function use
     * @memberof api
     * @param {...any} args - Middleware functions or routers.
     * @returns {Express.Router}
     *
     * @example
     * api.use(authMiddleware)
     */
    use(...args) {
      return router.use(...args)
    },

    /**
     * The Express router instance.
     * @type {Express.Router}
     * @memberof api
     */
    router,
  }

  return api
}
