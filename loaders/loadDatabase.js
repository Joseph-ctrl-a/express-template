/** @typedef {Express} Express */
/**
 * Initializes the MongoDB connection and starts the Express server.
 *
 * Handles asynchronous database connection setup and safely starts
 * the HTTP server. Logs success or failure messages and terminates
 * the process gracefully on critical errors.
 *
 * @module loadDatabase
 * @async
 * @function
 * @param {Function} connectDB - Function establishing a MongoDB connection.
 * @param {Express.Express} app - Express application instance.
 * @returns {Promise<void>} Resolves once the server is successfully running.
 *
 * @example
 * const express = require('express');
 * const { connectDB } = require('./db/connectDB');
 * const loadDatabase = require('./loadDatabase');
 *
 * const app = express();
 *
 * (async () => {
 *   await loadDatabase(connectDB, app);
 * })();
 */

const PORT = process.env.PORT || 5000

/**
 * Connects to the database and starts the Express application.
 *
 * @async
 * @param {Function} connectDB - Function that connects to MongoDB.
 * @param {Express.Express} app - Express app instance.
 * @returns {Promise<void>}
 */
const loadDatabase = async (connectDB, app) => {
  try {
    await connectDB()
    console.log('Database connection established successfully.')

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

module.exports = loadDatabase
