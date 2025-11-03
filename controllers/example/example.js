/** @typedef {Express} Express */
// @ts-nocheck
/**
 * Example controller module.
 *
 * This controller demonstrates how to structure CRUD logic
 * in a dependency-injected environment. Controllers are automatically
 * loaded via the `controllerResolver` utility in `utils/controllerUtils.js`.
 *
 * Each controller must export an `inject()` method that returns an
 * object of route action handlers (e.g., getAll, getById, create, update, remove).
 *
 * @module controllers/example
 */

module.exports = {
  /**
   * Injects shared dependencies and returns controller action methods.oka
   *
   * @param {{ helpers: Object }} deps - Dependency container injected by the controller resolver.
   * @returns {Record<string, Express.RequestHandler>} Map of controller actions.
   *
   * @example
   * const exampleController = require('./example').inject({ helpers })
   * app.get('/', exampleController.getAll)
   */
  inject({ helpers }) {
    const { response, error } = helpers

    return {
      /**
       * Retrieves a list of example resources.
       * @route GET /example
       * @returns {Object[]} 200 - List of example objects.
       */
      async getAll(req, res) {
        try {
          const data = [
            { id: 1, name: 'Alpha' },
            { id: 2, name: 'Beta' },
          ]
          response.ok({ res, data })
        } catch (err) {
          error.throwServer(res, err.message)
        }
      },

      /**
       * Retrieves a single example resource by ID.
       * @route GET /example/:id
       * @param {string} id.path.required - The unique identifier of the resource.
       * @returns {Object} 200 - The resource object.
       */
      async getById(req, res) {
        try {
          const id = req.params.id
          if (!id) return error.throwBadRequest(res, 'Missing resource ID')

          // Example stub data
          const data = { id, name: 'Example Resource' }
          response.ok({ res, data })
        } catch (err) {
          error.throwServer(res, err.message)
        }
      },

      /**
       * Creates a new resource.
       * @route POST /example
       * @returns {Object} 201 - The created resource.
       */
      async create(req, res) {
        try {
          const newItem = { id: Date.now(), ...req.body }
          response.created({ res, data: newItem })
        } catch (err) {
          error.throwValidation(res, err.message)
        }
      },

      /**
       * Updates an existing resource by ID.
       * @route PUT /example/:id
       * @returns {Object} 200 - The updated resource.
       */
      async update(req, res) {
        try {
          const id = req.params.id
          if (!id) return error.throwBadRequest(res, 'Missing resource ID')

          const updated = { id, ...req.body, updatedAt: new Date() }
          response.ok({ res, data: updated })
        } catch (err) {
          error.throwServer(res, err.message)
        }
      },

      /**
       * Deletes a resource by ID.
       * @route DELETE /example/:id
       * @returns {void} 204 - No content.
       */
      async remove(req, res) {
        try {
          const id = req.params.id
          if (!id) return error.throwBadRequest(res, 'Missing resource ID')

          // Simulate deletion
          response.noContent({ res })
        } catch (err) {
          error.throwServer(res, err.message)
        }
      },
    }
  },
}
