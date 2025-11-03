// @ts-check
/**
 * Application entry point.
 *
 * Bootstraps the Express server, loads environment variables,
 * connects to MongoDB, initializes global middleware, and mounts routes.
 *
 * The project follows a modular architecture using dependency injection
 * and a centralized helper object (`helperObject`) for managing responses,
 * errors, middleware, and route creation.
 *
 * @module server
 */

require('dotenv').config()
const express = require('express')
const app = express()

// --- Core Imports ---
const { helperObject } = require('./helpers')
const { connectDB } = require('./db/connect')

// --- Loaders (modular startup steps) ---
const loadRoutes = require('./loaders/loadRoutes')
const loadDatabase = require('./loaders/loadDatabase')
const loadMiddleware = require('./loaders/loadMiddleWare')

/**
 * Initializes the full application startup sequence.
 *
 * Loads middleware, registers all route modules,
 * connects to the MongoDB database, and starts the server.
 * If any step fails, the process logs the error and exits gracefully.
 *
 * @async
 * @function startApp
 * @returns {Promise<void>} Resolves once the app is fully initialized and listening.
 *
 * @example
 * // Run directly with Node
 * node server.js
 */
const startApp = async () => {
  try {
    // --- Initialize global middleware ---
    loadMiddleware(app)

    // --- Load all route modules dynamically ---
    await loadRoutes(app, helperObject())

    // --- Connect to database and start server ---
    await loadDatabase(connectDB, app)
  } catch (error) {
    console.error('Application startup failed:', error)
    process.exit(1)
  }
}

// --- Execute startup sequence ---
startApp()

module.exports = app
