/** @typedef {Express} Express */
const path = require('path')
const express = require('express')
const { getFolderPath } = require('../utils/getFolderPath')

/**
 * Global Middleware Utilities
 *
 * Provides reusable Express helpers for serving static files
 * and parsing request bodies (JSON, URL-encoded).
 *
 * @module globalMiddleware
 */

/**
 * Creates a collection of static file-serving utilities.
 *
 * Each method returns an Express middleware that can be mounted
 * directly in your routes or app configuration.
 *
 * @function createStaticOps
 * @returns {Object} Static serving operations.
 *
 * @property {Function} serve - Serves static files from a given folder.
 * @property {Function} serveFrom - Serves static files relative to a given module directory.
 * @property {Function} serveWithCache - Serves static files with caching and immutable headers.
 * @property {Function} serveFile - Sends a single file directly.
 *
 * @example
 * const { createStaticOps } = require('./middleware/global')
 * const app = express()
 * const staticOps = createStaticOps()
 *
 * // Serve static folder
 * app.use('/public', staticOps.serve('public'))
 *
 * // Serve from another module’s folder
 * app.use('/docs', staticOps.serveFrom(__dirname, 'docs'))
 *
 * // Serve cached static assets
 * app.use('/assets', staticOps.serveWithCache('assets', '7d'))
 *
 * // Serve a single file
 * app.get('/download', (req, res) =>
 *   staticOps.serveFile(req, res, 'files', 'manual.pdf')
 * )
 */
function createStaticOps() {
  return {
    /**
     * Serves static files from the specified folder within the project root.
     *
     * @function serve
     * @param {string} [folder='methods-public'] - Folder name within the project root.
     * @returns {Express.RequestHandler} Express middleware.
     */
    serve(folder = 'methods-public') {
      return express.static(getFolderPath(folder))
    },

    /**
     * Serves static files from a folder relative to a specific module directory.
     *
     * @function serveFrom
     * @param {string} moduleDir - Absolute path to the module directory.
     * @param {string} [folder='methods-public'] - Folder name within that directory.
     * @returns {Express.RequestHandler} Express middleware.
     */
    serveFrom(moduleDir, folder = 'methods-public') {
      return express.static(path.resolve(moduleDir, folder))
    },

    /**
     * Serves static files with HTTP caching enabled.
     *
     * @function serveWithCache
     * @param {string} [folder='methods-public'] - Folder name within the project root.
     * @param {string} [maxAge='1d'] - Cache duration (Express static syntax, e.g. '1d', '7d').
     * @returns {Express.RequestHandler} Express middleware.
     *
     * @example
     * app.use('/assets', staticOps.serveWithCache('assets', '30d'))
     */
    serveWithCache(folder = 'methods-public', maxAge = '1d') {
      return express.static(getFolderPath(folder), {
        maxAge,
        etag: true,
        immutable: true,
      })
    },

    /**
     * Sends a single static file to the client.
     *
     * @function serveFile
     * @param {Express.Request} req - Express request object.
     * @param {Express.Response} res - Express response object.
     * @param {string} folder - Folder where the file is located.
     * @param {string} file - Filename to send.
     * @throws {Error} Throws if folder or file parameters are missing.
     * @returns {Express.Response} Response object.
     *
     * @example
     * app.get('/file', (req, res) =>
     *   staticOps.serveFile(req, res, 'files', 'example.txt')
     * )
     */
    serveFile(req, res, folder, file) {
      if (!(folder && file)) throw new Error('incorrect params')
      return res.sendFile(path.resolve(getFolderPath(folder), file))
    },
  }
}

/**
 * Express JSON parser middleware.
 *
 * @function jsonParser
 * @returns {Express.RequestHandler} Middleware for parsing JSON request bodies.
 *
 * @example
 * app.use(jsonParser())
 */
function jsonParser() {
  return express.json()
}

/**
 * Express URL-encoded parser middleware.
 *
 * @function urlencodedParser
 * @returns {Express.RequestHandler} Middleware for parsing URL-encoded request bodies.
 *
 * @example
 * app.use(urlencodedParser())
 */
function urlencodedParser() {
  return express.urlencoded({ extended: true })
}

module.exports = {
  jsonParser,
  urlencodedParser,
  createStaticOps,
}
