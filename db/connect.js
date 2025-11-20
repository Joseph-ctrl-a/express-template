const mongoose = require('mongoose')
const { DatabaseConnectionError } = require('../utils/error')

const DB_URL = process.env.DB_URL

/**
 * MongoDB Connection Utility
 *
 * Establishes a connection to a MongoDB database using Mongoose.
 *
 * Wraps connection logic in a try/catch block and throws a custom
 * `DatabaseConnectionError` on failure for consistent error handling.
 *
 * @module connectDB
 * @async
 * @function connectDB
 * @throws {DatabaseConnectionError} When the database connection fails.
 * @returns {Promise<void>} Resolves when the connection is successful.
 *
 * @example
 * const { connectDB } = require('./db/connectDB')
 *
 * (async () => {
 *   try {
 *     await connectDB()
 *     console.log('Database connected successfully')
 *   } catch (err) {
 *     console.error('Database connection failed:', err.message)
 *   }
 * })()
 */
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL)
    console.log(`Connected To the DB ${mongoose.connection.name}`)
  } catch (error) {
    console.error(error)
    throw new DatabaseConnectionError('Database connection failed')
  }
}

module.exports = { connectDB }
