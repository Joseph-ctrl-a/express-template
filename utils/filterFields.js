// @ts-check
/**
 * Creates a filtered shallow copy of an object, keeping only the specified keys.
 *
 * Useful for shaping API responses — for example, removing sensitive fields
 * like passwords, tokens, or internal metadata.
 */

const { InvalidParamTypeError } = require('./error')

/**
 * Filters an object to include only the keys listed in `fields`.
 *
 * @param {string[]} [fields=[]] - Keys to retain.
 * @param {Object} [object={}] - The source object to filter.
 * @returns {Object} A new object containing only the allowed fields.
 *
 * @throws {InvalidParamTypeError}
 * If `fields` is not an array, or `object` is not a valid object.
 *
 * @example
 * const user = {
 *   id: 1,
 *   name: 'Joseph',
 *   password: 'secret',
 *   role: 'admin'
 * }
 *
 * const result = filterFields(['id', 'name'], user)
 * // result: { id: 1, name: 'Joseph' }
 */
const filterFields = (fields = [], object = {}) => {
  if (!Array.isArray(fields)) {
    throw new InvalidParamTypeError(fields, 'array', typeof fields)
  }

  if (typeof object !== 'object' || object === null) {
    throw new InvalidParamTypeError(object, 'object', typeof object)
  }

  if (fields.length === 0) return object
  return Object.fromEntries(
    Object.entries(object).filter(([key]) =>
      fields.includes(key.toString().toLocaleLowerCase()),
    ),
  )
}

module.exports = { filterFields }
