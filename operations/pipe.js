// --- PIPE UTILITIES ---

/**
 * Creates a pipeline utility for composing and executing
 * sequences of functions (operations) on data.
 *
 * Useful for building data transformation chains that can be
 * extended dynamically and optionally run with callbacks.
 *
 * @module pipe
 * @returns {Object} Pipe factory with a `create()` method.
 *
 * @example
 * const { createPipeOps } = require('./pipe.js')
 *
 * const pipe = createPipeOps().create({
 *   arrayStore: [1, 2, 3],
 *   arrayFunc: [arr => arr.map(x => x * 2)],
 * })
 *
 * pipe
 *   .use(arr => arr.filter(x => x > 2))
 *   .run()
 *   .then(result => console.log(result)) // [4, 6]
 */
function createPipeOps() {
  return {
    /**
     * Creates a new pipe instance that manages a list of transformation
     * functions and provides methods to extend or execute them.
     *
     * @function create
     * @memberof module:pipe
     * @param {Object} [options={}] - Configuration options.
     * @param {Array|*} [options.arrayStore=[]] - Initial data or data array to process.
     * @param {Function[]} [options.arrayFunc=[]] - Array of transformation functions.
     * @param {Function[]} [options.runLast=[]] - Functions appended at the end of the pipeline before execution.
     * @param {Function|null} [callBack=null] - Optional callback executed after pipeline runs.
     * @returns {Object} Pipe instance with methods: `use`, `run`, and `clear`.
     *
     * @example
     * const pipe = createPipeOps().create({ arrayStore: [1, 2, 3] })
     * pipe
     *   .use(arr => arr.map(x => x + 1))
     *   .use(arr => arr.filter(x => x > 2))
     *   .run()
     *   .then(result => console.log(result)) // [3, 4]
     */
    create(
      { arrayStore = [], arrayFunc = [], runLast = [] } = {},
      callBack = null,
    ) {
      arrayStore = Array.isArray(arrayStore) ? [...arrayStore] : arrayStore
      arrayFunc = [...arrayFunc]

      /**
       * Pipe instance object with chainable operations.
       * @namespace pipe
       */
      const pipe = {
        /**
         * Adds a new transformation function to the pipeline.
         *
         * @function use
         * @memberof pipe
         * @param {Function} fn - Transformation function to add.
         * @returns {pipe} The current pipe instance for chaining.
         *
         * @example
         * pipe.use(arr => arr.map(x => x * 2))
         */
        use(fn) {
          arrayFunc.push(fn)
          return this
        },

        /**
         * Executes the pipeline on the provided or stored data.
         *
         * @function run
         * @memberof pipe
         * @param {*} [initial=arrayStore] - Initial data to pass into the pipeline.
         * @returns {Object|pipe} A chainable result object with `.map()`, `.then()`, and `.value()`
         *                       methods, or the pipe instance if `callBack` was provided.
         *
         * @example
         * pipe
         *   .use(arr => arr.map(x => x + 1))
         *   .run()
         *   .map(res => console.log(res)) // Intermediate map
         *   .then(console.log) // Final result
         */
        run(initial = arrayStore) {
          arrayFunc = [...arrayFunc, ...runLast]
          const result = !arrayFunc.length
            ? initial
            : arrayFunc.reduce((data, fn) => fn(data), initial)

          if (callBack) return this.then(callBack)

          return {
            /**
             * Transforms the result using a provided function.
             * Does not modify the original pipeline.
             *
             * @function map
             * @memberof pipe
             * @param {Function} nextFn - Function applied to the result.
             * @returns {Object} New result object containing `result`.
             */
            map(nextFn) {
              const nextResult = nextFn(result)
              return { ...this, result: nextResult }
            },

            /**
             * Executes a callback function with the final pipeline result.
             *
             * @function then
             * @memberof pipe
             * @param {Function} nextFn - Callback invoked with the result.
             * @returns {pipe} The original pipe for chaining.
             */
            then(nextFn) {
              nextFn(result)
              return pipe
            },

            /**
             * Returns the final computed value from the pipeline.
             *
             * @function value
             * @memberof pipe
             * @returns {*} The result of executing all pipeline functions.
             */
            value() {
              return result
            },
          }
        },

        /**
         * Clears all stored transformation functions but keeps the data.
         *
         * @function clear
         * @memberof pipe
         * @returns {pipe} A new pipe instance with cleared functions.
         *
         * @example
         * const clearedPipe = pipe.clear()
         */
        clear() {
          return this.create({ arrayStore, arrayFunc: [] })
        },
      }

      return pipe
    },
  }
}

module.exports = createPipeOps
