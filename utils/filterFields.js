// @ts-check
/**
 * Filters an object to include only specified fields.
 *
 * This higher-order utility returns a filtering function that, when applied
 * to an object, produces a shallow copy containing only the keys defined
 * in the provided `fields` array.
 *
 * Commonly used to control which properties are exposed in API responses
 * (for example, omitting sensitive or irrelevant data fields).
 *
 * @module utils/filterFields
 */

const { InvalidParamTypeError } = require('./error')

/**
 * Creates a function that filters objects to include only specific keys.
 *
 * @function filterFields
 * @param {string[]} [fields=[]] - Array of field names to retain.
 * @returns {(object: Object) => Object}
 * Function that accepts an object and returns a shallow copy containing
 * only the specified fields.
 *
 * @throws {InvalidParamTypeError} If `fields` is not an array or if the provided
 * argument is not a plain object.
 *
 * @example
 * const { filterFields } = require('./utils/filterFields')
 *
 * const user = { id: 1, name: 'Joseph', password: 'secret', role: 'admin' }
 * const filterUser = filterFields(['id', 'name'])
 *
 * console.log(filterUser(user))
 * // => { id: 1, name: 'Joseph' }
 */
const filterFields =
  (fields = []) =>
  (object = {}) => {
    // --- Defensive validation ---
    if (!Array.isArray(fields)) {
      throw new InvalidParamTypeError(fields, 'array', typeof fields)
    }

    if (typeof object !== 'object' || object === null) {
      throw new InvalidParamTypeError(object, 'object', typeof object)
    }

    // --- Skip filtering if no fields are specified ---
    if (fields.length === 0) return object

    // --- Construct a new filtered object ---
    return Object.fromEntries(
      Object.entries(object).filter(([key]) => fields.includes(key)),
    )
  }

module.exports = { filterFields }
