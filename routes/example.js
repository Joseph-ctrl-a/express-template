/** @typedef {Express} Express */
// @ts-check
/**
 * Example route module.
 *
 * This file serves as a template for defining API routes using
 * the controller auto-binding pattern. It demonstrates how to link
 * route definitions to controller methods through the `controllerResolver`
 * utility, which automatically injects shared helpers.
 *
 * To create a new module, duplicate this file and rename it (e.g., `users.js`),
 * then create a matching controller in `/controllers/<name>/<name>.js`.
 *
 * @module routes/example
 * @param {Object} helpers - Shared helper object containing response, error, middleware, and route utilities.
 * @returns {Express.Router} Configured Express router instance.
 */

const { controllerResolver } = require('../utils/controllerUtils');

module.exports = (/** @type {Object} */ helpers) => {
  // @ts-ignore
  const { route } = helpers;

  /**
   * Helper for resolving controller actions for this module.
   * @param {string} action - The controller method name (e.g., "getAll", "create").
   * @returns {Express.RequestHandler} Express handler bound to the controller.
   */
  const controller = action => controllerResolver('example', action, helpers);

  // -----------------------------------------
  // Example CRUD Routes
  // -----------------------------------------

  // GET /example → exampleController.getAll()
  route.get('/', controller('getAll'));

  // GET /example/:id → exampleController.getById()
  route.get('/:id', controller('getById'));

  // POST /example → exampleController.create()
  route.post('/', controller('create'));

  // PUT /example/:id → exampleController.update()
  route.put('/:id', controller('update'));

  // DELETE /example/:id → exampleController.remove()
  route.delete('/:id', controller('remove'));

  // Return Express router instance
  return route.router;
};
