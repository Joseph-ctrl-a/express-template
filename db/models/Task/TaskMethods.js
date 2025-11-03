// @ts-check
/**
 * Utility functions and schema method extensions for Mongoose Task model.
 * Provides safe query wrappers and validation for common database operations.
 */

const { Types } = require('mongoose')
const { taskSchema } = require('../../../validators/exampleSchema')
const {
  BadRequestError,
  NotFoundError,
  InvalidParamTypeError,
  MissingParamError,
} = require('../../../utils/error')

/**
 * Safely finds a document by its MongoDB ObjectId.
 * Validates the ID before querying, and throws if the document is not found.
 *
 * @this Mongoose.Model
 * @param {string} id - The MongoDB ObjectId to look up.
 * @returns {Promise<Mongoose.Document>} The found document.
 * @throws {BadRequestError} If the ID format is invalid.
 * @throws {NotFoundError} If the document does not exist.
 */
async function safeFindById(id) {
  if (!Types.ObjectId.isValid(id))
    throw new BadRequestError('Invalid ID format')

  const document = await this.findById(id).exec()
  if (!document) throw new NotFoundError('Task not found')
  return document
}

/**
 * Safely applies a limit to a Mongoose query.
 * Validates the limit using the taskSchema before applying.
 *
 * @this Mongoose.Query
 * @param {number} n - The number of results to limit the query to.
 * @returns {Mongoose.Query} The modified query with the applied limit.
 * @throws {BadRequestError} If the limit is invalid.
 */
function safeLimit(n) {
  if (!n) return this
  const { success, data } = taskSchema.limit.safeParse(n)
  if (!success) throw new BadRequestError('Invalid Limit')
  return this.limit(data)
}

/**
 * Safely performs a "starts with" query on a specified key.
 * Validates the search parameter and checks that the key exists in the Task schema.
 *
 * @this Mongoose.Query
 * @param {string} searchParam - The string to search for at the start of the field.
 * @param {string} key - The schema field name to query.
 * @param {Mongoose.Model} Task - The Mongoose model for validation.
 * @returns {Mongoose.Query} The modified query with the applied filter.
 * @throws {BadRequestError} If the search parameter or key is invalid.
 */
function safeStartsWith(searchParam, key, Task) {
  if (!searchParam) return this
  const { success, data } = taskSchema.searchParam.safeParse(searchParam)
  if (!success) throw new BadRequestError('Invalid searchParam')
  if (!(key in Task.schema.paths))
    throw new BadRequestError(`No Property ${key} found`)

  const escapeRegex = (/** @type {string} */ str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return this.where(key, new RegExp(`^${escapeRegex(data)}`, 'i'))
}

/**
 * Applies an array of static methods to a Mongoose schema.
 *
 * @param {Mongoose.Schema} TaskSchema - The Mongoose schema to extend.
 * @param {Array<{ name: string, fn: Function }>} methods -
 *   An array of objects where each contains:
 *   - `name`: the name of the static method
 *   - `fn`: the function implementation
 *
 * @throws {InvalidParamTypeError} If methods is not an array.
 * @throws {MissingParamError} If TaskSchema or methods are missing.
 */
function applyStaticMethods(TaskSchema, methods) {
  if (!Array.isArray(methods)) {
    throw new InvalidParamTypeError('methods', 'Array', typeof methods)
  }

  if (!TaskSchema) {
    throw new MissingParamError('TaskSchema')
  }

  if (!methods) {
    throw new MissingParamError('methods')
  }

  // Apply each method by iterating over the array
  for (const { name, fn } of methods) {
    if (typeof fn !== 'function' && typeof name !== 'string') {
      throw new InvalidParamTypeError(
        'method',
        '{fn: function, name: string}',
        `name: ${Function} and fn: ${Function}`,
      )
    }
    if (typeof name !== 'string') {
      throw new InvalidParamTypeError('method', 'string', typeof name)
    }
    if (typeof fn !== 'function') {
      throw new InvalidParamTypeError('method', 'function', typeof name)
    }
    TaskSchema.statics[name] = fn
  }
}

/**
 * Placeholder for applying query helper methods to a Mongoose schema.
 *
 * @param {Record<string, Function>} params - An object containing query helper functions.
 */
;`function applyQueryMethods(params) {
  // TODO: Implement query helper method registration
}`

module.exports = {
  safeFindById,
  safeLimit,
  safeStartsWith,
  applyStaticMethods,
}
