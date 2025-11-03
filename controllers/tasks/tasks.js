/** @typedef {Express} Express */
// @ts-check
/**
 * Controller module for Task-related operations.
 *
 * Demonstrates how to structure MongoDB-backed controllers using injected dependencies,
 * safe query methods, and a unified response handling utility.
 *
 * This module uses the `Task` model, Zod-based schemas, and the shared `helpers` object
 * for consistent error handling and API responses.
 *
 * @module controllers/tasks
 */

const {
  handleDependencyError,
  createHandleReturn,
} = require('../../utils/controllerUtils')

module.exports = {
  /**
   * Injects dependencies into the Task controller.
   *
   * @function inject
   * @param {{
   *   helpers: {
   *     response: ReturnType<import('../../operations/response')>,
   *     error: ReturnType<import('../../operations/error')>
   *   },
   *   Task: Mongoose.Model<any>,
   *   schemas: Object
   * }} dependencies - Object containing injected helpers, models, and schemas.
   *
   * @returns {Object} Controller methods for handling Task operations.
   *
   * @throws {import('../../utils/error').DependencyError}
   * If required dependencies are missing or invalid.
   *
   * @example
   * const tasksController = require('./controllers/tasks/tasks').inject({
   *   helpers,
   *   Task,
   *   schemas: taskSchema
   * })
   * app.get('/tasks', tasksController.getAllTasks)
   */
  inject(dependencies) {
    const { helpers, Task, schemas } = dependencies

    // --- Validate Dependencies ---
    handleDependencyError(helpers, Task, schemas)

    const { response, error } = helpers
    const handleTaskReturn = createHandleReturn(error, response)

    return {
      /**
       * Retrieves all tasks, with optional filtering and limiting.
       *
       * @function getAllTasks
       * @param {Express.Request} req - Express request object.
       * @param {Express.Response} res - Express response object.
       * @returns {{
       *   limit: (n: number) => any,
       *   startsWith: (searchParam?: string, key?: string) => any,
       *   all: Function
       * }}
       */
      getAllTasks(req, res) {
        let query = Task.find({})

        return {
          /**
           * Applies a limit to the number of returned tasks.
           * @param {number} n - Maximum number of results to return.
           * @returns {this}
           */
          limit(n) {
            try {
              query = query.safeLimit(n)
            } catch (err) {
              return handleTaskReturn(res, Promise.reject(err))
            }
            return this
          },

          /**
           * Filters tasks whose field value starts with the provided search parameter.
           * @param {string} [searchParam=''] - Search term.
           * @param {string} [key='description'] - Field to filter by.
           * @returns {this}
           */
          startsWith(searchParam = '', key = 'description') {
            try {
              if (!searchParam || !key) return this
              query = query.safeStartsWith(searchParam, key, Task)
            } catch (err) {
              return handleTaskReturn(res, Promise.reject(err))
            }
            return this
          },

          /**
           * Executes the constructed query and returns the results.
           * @async
           * @returns {Promise<void>}
           */
          async all() {
            try {
              const data = await query.exec()
              return handleTaskReturn(res, data)
            } catch (err) {
              return handleTaskReturn(res, Promise.reject(err))
            }
          },
        }
      },

      /**
       * Retrieves a single task by its unique ID.
       *
       * @function getTaskById
       * @param {Express.Request} req - Express request object.
       * @param {Express.Response} res - Express response object.
       * @returns {{
       *   where: ({ id }: { id: string }) => Promise<void>
       * }}
       */
      getTaskById(req, res) {
        return {
          async where({ id }) {
            return handleTaskReturn(res, Task.safeFindById(id))
          },
        }
      },
    }
  },
}
