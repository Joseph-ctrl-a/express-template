/** @typedef {Express} Express */
const bcrypt = require('bcryptjs');
/**
 * Authorization Middleware (Placeholder)
 *
 * Provides a simple Express middleware for route protection.
 *
 * Currently acts as a placeholder — always calls `next()`,
 * but can later be extended to verify authentication tokens,
 * user roles, or session data.
 *
 * @module authorize
 * @returns {Express.RequestHandler} Express middleware function.
 *
 * @example
 * const express = require('express')
 * const { authorize } = require('./middleware/auth')
 * const app = express()
 *
 * // Protect a route
 * app.get('/dashboard', authorize(), (req, res) => {
 *   res.send('Protected route')
 * })
 *
 * // Extend in the future
 * function authorize() {
 *   return (req, res, next) => {
 *     const token = req.headers.authorization
 *     if (!token) return createErrorOps().throwUnauthorized(res)
 *     next()
 *   }
 * }
 */
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function verifyPasswordClientSide(password, hash) {
  return await bcrypt.compare(password, hash);
}
function auth() {
  return (res, req) => {
    console.log('auth');
    next();
  };
}
module.exports = { hashPassword, verifyPasswordClientSide, auth };
