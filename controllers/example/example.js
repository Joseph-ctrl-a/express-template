/** @typedef {Express} Express */
// @ts-nocheck

/**
 * Example controller module.
 *
 * Controllers are loaded via the `controllerResolver` utility.
 * Each controller exposes an `inject()` method that returns
 * a set of Express route handlers.
 *
 * All controller methods:
 * - Use try/catch for failures
 * - Forward errors via `next(err)`
 * - Use response helpers ONLY for success
 *
 * @module controllers/example
 */

module.exports = {
  /**
   * Inject shared dependencies and return controller action handlers.
   *
   * @param {{ helpers: { response: Object } }} deps - Dependency container.
   * @returns {Record<string, Express.RequestHandler>} Controller actions.
   */
  inject({ helpers }) {
    const { response } = helpers

    return {
      /**
       * Retrieves a list of example resources.
       * @route GET /example
       * @returns {Object[]} 200 - List of example data.
       */
      async getAll(req, res, next) {
        try {
          const data = [
            { id: 1, name: 'Alpha' },
            { id: 2, name: 'Beta' },
          ]

          response.ok({ res, data })
        } catch (err) {
          next(err)
        }
      },

      /**
       * Retrieves a single example resource by ID.
       * @route GET /example/:id
       * @param {string} id.path.required - The resource ID.
       * @returns {Object} 200 - The resource object.
       */
      async getById(req, res, next) {
        try {
          const id = req.params.id

          if (!id) {
            throw new Error('Missing resource ID')
          }

          const data = { id, name: 'Example Resource' }

          response.ok({ res, data })
        } catch (err) {
          next(err)
        }
      },

      /**
       * Creates a new example resource.
       * @route POST /example
       * @returns {Object} 201 - The created resource.
       */
      async create(req, res, next) {
        try {
          const newItem = { id: Date.now(), ...req.body }

          response.created({ res, data: newItem })
        } catch (err) {
          next(err)
        }
      },

      /**
       * Updates an example resource.
       * @route PUT /example/:id
       * @returns {Object} 200 - The updated resource.
       */
      async update(req, res, next) {
        try {
          const id = req.params.id

          if (!id) {
            throw new Error('Missing resource ID')
          }

          const updated = {
            id,
            ...req.body,
            updatedAt: new Date(),
          }

          response.ok({ res, data: updated })
        } catch (err) {
          next(err)
        }
      },

      /**
       * Deletes an example resource.
       * @route DELETE /example/:id
       * @returns {void} 204 - No content.
       */
      async remove(req, res, next) {
        try {
          const id = req.params.id

          if (!id) {
            throw new Error('Missing resource ID')
          }

          response.noContent({ res })
        } catch (err) {
          next(err)
        }
      },
    }
  },
}
