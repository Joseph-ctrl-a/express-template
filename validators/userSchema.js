const { z } = require('zod')
const { filterFields } = require('../utils/filterFields')

const registerObject = {
  username: z
    .string()
    .min(4)
    .max(20)
    .regex(/^[A-Za-z0-9]+$/i, 'Only letters and numbers allowed'),

  email: z.email(),

  password: z.string().min(6).max(30).regex(/^\S+$/),
}

const loginObject = filterFields(['email', 'password'], registerObject)
const registerSchema = z.object(registerObject)
const loginSchema = z.object(loginObject)
module.exports = { registerSchema, loginSchema }
