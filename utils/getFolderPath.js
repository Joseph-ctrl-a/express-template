// @ts-check
/**
 * Resolves absolute folder paths relative to the project root.
 *
 * This utility wraps Node.js’s `path.resolve()` to consistently resolve
 * paths from the current working directory (`process.cwd()`), ensuring
 * reliable results regardless of where the module is invoked.
 *
 * @module utils/getFolderPath
 */

const path = require('path')

/**
 * Resolves an absolute path for a given folder name or relative path.
 *
 * @function getFolderPath
 * @param {string} folder - Folder name or relative path to resolve from the project root.
 * @returns {string} Absolute path to the specified folder.
 *
 * @example
 * // Assuming the project root is /Users/joseph/projects/express-api
 * getFolderPath('public')
 * // => '/Users/joseph/projects/express-api/public'
 *
 * getFolderPath('src/utils')
 * // => '/Users/joseph/projects/express-api/src/utils'
 */
const getFolderPath = folder => path.resolve(process.cwd(), folder)

module.exports = { getFolderPath }
