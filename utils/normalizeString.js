/**
 * Normalizes a user-provided string for use inside a Zod `.transform()` call.
 *
 * ⚠ IMPORTANT:
 * This function is NOT a Zod method. It must be passed *into* a Zod `.transform()`
 * for it to work. It does not modify the schema by itself.
 *
 * Example usage:
 *   z.string().transform(normalizeString)
 *
 * What it does:
 * - Normalizes Unicode to NFC form
 * - Trims leading and trailing whitespace
 * - Removes *all* internal whitespace (spaces, tabs, newlines)
 *
 * @param {string} s - The string being transformed by Zod.
 * @returns {string} - The normalized and cleaned string.
 */
function normalizeString(s) {
  return s.normalize('NFC').trim().replace(/\s+/g, '')
}
module.exports = { normalizeString }
