// @ts-nocheck
/**
 * Example Zod schema template.
 *
 * This file demonstrates how to define validation logic
 * for request payloads, parameters, and query strings
 * using the Zod library. You can remove or duplicate this file
 * to create your own module-specific schemas.
 *
 * @module validators/exampleSchema
 */

const { z } = require('zod')

/**
 * Example schema object showing common validation patterns.
 *
 * Each key represents a reusable validation schema.
 *
 * @namespace exampleSchema
 * @property {Zod.ZodCoercedNumber} limit - Validates positive integers for pagination or limiting queries.
 * @property {Zod.ZodEffects<Zod.ZodString>} search - Validates and normalizes string parameters.
 */
const exampleSchema = {
  /**
   * Validates a positive integer limit value.
   * Useful for pagination, limits, or counts.
   *
   * @type {Zod.ZodCoercedNumber}
   *
   * @example
   * exampleSchema.limit.parse('10') // => 10
   * exampleSchema.limit.parse('-5') // throws ZodError
   */
  limit: z.coerce.number().int().positive(),

  /**
   * Validates and normalizes a search string.
   * Trims whitespace, lowercases, and normalizes unicode.
   *
   * @type {Zod.ZodEffects<Zod.ZodString>}
   *
   * @example
   * exampleSchema.search.parse('  TEST ') // => "test"
   * exampleSchema.search.parse('') // throws ZodError
   */
  search: z.coerce
    .string()
    .min(1, 'Search term cannot be empty')
    .trim()
    .toLowerCase()
    .transform(str => str.normalize('NFKC')),
}

module.exports = { exampleSchema }
