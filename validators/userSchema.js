const { z } = require('zod')
function createUserSchemaObject() {
  return {
    username: z
      .string()
      .min(4)
      .max(20)
      .regex(/^[A-Za-z0-9]+$/i, 'Only letters and numbers allowed'),

    email: z.email(),

    password: z.string().min(6).max(30).regex(/^\S+$/),
  }
}
const user = z.object(createUserSchemaObject())
module.exports = { user }
