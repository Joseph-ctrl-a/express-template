/** @typedef {Express} Express */
const { DependencyError } = require('./error')
const path = require('path')
function handleDependencyError(helpers, Task, schemas) {
  if (typeof helpers !== 'object' || Array.isArray(helpers))
    throw new DependencyError(
      'helpers',
      `Expected an object, received ${Function}`,
    )

  if (typeof Task !== 'function' || !Task.findById)
    throw new DependencyError(
      'Task',
      `Expected a valid Mongoose model, received ${Function}`,
    )

  if (typeof schemas !== 'object')
    throw new DependencyError(
      'schemas',
      `Expected a schema object, received ${Function}`,
    )
}

function createHandleReturn(error, response) {
  return async function (res, dataPromise) {
    try {
      if (res.headersSent) return
      const data = await dataPromise
      if (!data) return error.throwNotFound(res)
      return response.ok({ res, data })
    } catch (err) {
      return error.throwCustom(res, err)
    }
  }
}

/**
 * Dynamically resolves and returns an Express route handler from a controller.
 *
 * @param {string} name - The controller name (e.g. "tasks", "users").
 * @param {string} action - The controller method name (e.g. "getAll", "create").
 * @param {Object} helpers - The shared helpers object (error, response, etc.).
 * @returns {(req: Express.Request, res: Express.Response) => Promise<void>}
 *
 * @example
 * const controller = controllerResolver('tasks', 'getAll', helpers)
 * route.get('/', controller)
 */
/**
 * Resolves a controller and returns the requested action handler.
 * Dependency injection is optional.
 *
 * Controller may export:
 * 1. inject({ helpers }) → returns handlers
 * 2. Direct handlers (no DI)
 *
 * @param {string} name - Controller folder & file name.
 * @param {string} action - The action method to execute.
 * @param {Object} helpers - Optional helper dependencies.
 * @returns {Function} Express route handler with async safety.
 */
function controllerResolver(name, action, helpers = {}) {
  const controllerPath = path.join(
    __dirname,
    '..',
    'controllers',
    name,
    `${name}.js`,
  )

  const controllerModule = require(controllerPath)

  let controller

  if (typeof controllerModule.inject === 'function') {
    controller = controllerModule.inject({ helpers })
  } else {
    controller = controllerModule
  }

  if (!controller[action] || typeof controller[action] !== 'function') {
    throw new Error(`Controller "${name}" does not define action "${action}".`)
  }

  return async (req, res, next) => {
    try {
      await controller[action](req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  handleDependencyError,
  createHandleReturn,
  controllerResolver,
}
