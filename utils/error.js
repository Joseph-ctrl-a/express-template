// @ts-check
/**
 * Centralized custom error classes for consistent API error handling.
 * Each subclass of AppError corresponds to a specific HTTP error category.
 */

/**
 * Base class for all application-specific errors.
 * Extends the native Error class with status code and error type metadata.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message.
   * @param {number} [statusCode=500] - HTTP status code associated with the error.
   * @param {string} [errorType] - A short, machine-readable identifier for the error type.
   */
  constructor(message, statusCode = 500, errorType) {
    super(message)
    /** @type {number} */
    this.statusCode = statusCode
    /** @type {string} */
    this.name = this.constructor.name
    /** @type {string | undefined} */
    this.errorType = errorType

    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Represents a 400 Bad Request error.
 * Typically thrown when a client sends invalid data or parameters.
 */
class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errorType = 'Invalid request') {
    super(message, 400, errorType)
  }
}

/**
 * Represents a 404 Not Found error.
 * Used when a requested resource could not be located.
 */
class NotFoundError extends AppError {
  constructor(message = 'Not Found', errorType = 'Not Found') {
    super(message, 404, errorType)
  }
}

/**
 * Represents a 500 Internal Server Error.
 * Indicates that an unexpected server-side issue occurred.
 */
class ServerError extends AppError {
  constructor(message = 'Internal Server Error', errorType = 'Server Error') {
    super(message, 500, errorType)
  }
}

/**
 * Represents a type mismatch error in parameter validation.
 * Used when a function receives a parameter of the wrong type.
 */
class InvalidParamTypeError extends AppError {
  /**
   * @param {string} paramName
   * @param {string} expectedType
   * @param {string} receivedType
   */
  constructor(paramName, expectedType, receivedType) {
    super(
      `Invalid type for parameter "${paramName}". Expected ${expectedType}, got ${receivedType}.`,
      500,
      'Invalid Parameter Type',
    )
  }
}

/**
 * Represents an error when a required parameter is missing.
 */
class MissingParamError extends AppError {
  /**
   * @param {any} paramName
   */
  constructor(paramName) {
    super(
      `Missing required parameter: "${paramName}".`,
      500,
      'Missing Parameter',
    )
  }
}

/**
 * Represents an error related to dependency injection failures.
 * Useful when required dependencies or services fail to initialize or resolve.
 */
class DependencyError extends AppError {
  /**
   * @param {any} dependencyName
   */
  constructor(dependencyName, message = '') {
    super(
      `Dependency injection failed: "${dependencyName}". ${message}`,
      500,
      'Dependency Error',
    )
  }
}

/**
 * Represents a database connection or query failure.
 * Typically thrown when the database cannot connect, authenticate,
 * or execute a query successfully.
 */
class DatabaseConnectionError extends AppError {
  /**
   * @param {string} [message='Database connection failed'] - Description of the database failure.
   * @param {string} [errorType='Database Error'] - Identifier for the type of database error.
   */
  constructor(
    message = 'Database connection failed',
    errorType = 'Database Error',
  ) {
    super(message, 500, errorType)
  }
}

module.exports = {
  AppError,
  BadRequestError,
  NotFoundError,
  ServerError,
  InvalidParamTypeError,
  MissingParamError,
  DependencyError,
  DatabaseConnectionError,
}
