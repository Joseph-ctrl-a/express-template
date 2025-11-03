/** @typedef {Express} Express */
const { logger } = require('../middleware/logger');
const { authorize: auth } = require('../auth/auth');
const global = require('../middleware/global');
const { corsWrapper } = require('../middleware/cors');

/**
 * Middleware Factory
 *
 * Centralized access point for common middleware utilities used across the application.
 * Returns a standardized set of middleware functions and helpers for Express apps.
 *
 * @module middlewareFactory
 * @returns {Object} Middleware utilities for Express setup.
 *
 * @property {Function} logger - Request logging middleware.
 * @property {Function} auth - Authorization middleware that protects routes.
 * @property {Object} static - Static file-serving utilities (from `global.createStaticOps()`).
 * @property {Function} json - JSON body parser middleware.
 * @property {Function} urlencoded - URL-encoded body parser middleware.
 * @property {Function} cors - CORS wrapper middleware for cross-origin requests.
 *
 * @example
 * const middleware = require('./factory/middlewareFactory')()
 * const app = express()
 *
 * // Apply middlewares
 * app.use(middleware.cors)
 * app.use(middleware.json)
 * app.use(middleware.urlencoded)
 * app.use(middleware.logger({ showTime: true }))
 *
 * // Use static serving
 * app.use('/public', middleware.static.serve('public'))
 */
module.exports = () => {
  return {
    /** @see module:middlewareFactory.logger */
    logger,

    /** @see module:middlewareFactory.auth */
    auth,

    /**
     * Static file-serving utilities.
     * @type {ReturnType<global.createStaticOps>}
     * @example
     * app.use('/public', middleware.static.serve('public'))
     */
    static: global.createStaticOps(),

    /**
     * Express JSON parser middleware.
     * @type {Express.RequestHandler}
     */
    json: global.jsonParser,

    /**
     * Express URL-encoded body parser middleware.
     * @type {Express.RequestHandler}
     */
    urlencoded: global.urlencodedParser,

    /**
     * CORS middleware wrapper for enabling cross-origin requests.
     * @type {Express.RequestHandler}
     */
    cors: corsWrapper,
  };
};
