// @ts-check
/**
 * Defines the Mongoose schema and model for Task documents.
 *
 * This module sets up the `Task` model, including custom static and
 * query methods for safe database operations. It demonstrates how
 * to organize models and extend them with reusable query helpers.
 *
 * @module db/models/Task/TaskModel
 */

const { Schema, model } = require('mongoose');
const { safeFindById, safeLimit, safeStartsWith } = require('./TaskMethods');

/**
 * Mongoose schema definition for the Task collection.
 *
 * @constant
 * @type {Mongoose.Schema}
 */
const TaskSchema = new Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [3, 'Description must be at least 3 characters long'],
    maxlength: [500, 'Description must be no longer than 500 characters'],
    trim: true,
  },
});

// ----------------------------------------
// Static Methods
// ----------------------------------------

/**
 * Finds a task by its ID with error-safe handling.
 *
 * @type {Function}
 * @memberof TaskSchema.statics
 */
TaskSchema.statics.safeFindById = safeFindById;

// ----------------------------------------
// Query Methods
// ----------------------------------------

/**
 * Limits the number of returned documents.
 *
 * @type {Function}
 * @memberof TaskSchema.query
 */
TaskSchema.query.safeLimit = safeLimit;

/**
 * Filters documents where a field value starts with a given string.
 *
 * @type {Function}
 * @memberof TaskSchema.query
 */
TaskSchema.query.safeStartsWith = safeStartsWith;

// ----------------------------------------
// Model Initialization
// ----------------------------------------

/**
 * The Mongoose Task model.
 *
 * @constant
 * @type {Mongoose.Model}
 *
 * @example
 * const { Task } = require('./TaskModel')
 * const tasks = await Task.find()
 */
const Task = model('tasks', TaskSchema);
Task.create({ description: 'this is another test task' });
module.exports = { Task };
