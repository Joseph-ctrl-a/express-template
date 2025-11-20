const express = require('express')
const { User: userModel } = require('../db/models/user/userModel')
const { user: userSchema } = require('../validators/userSchema')
module.exports = (helpers, userSchema, userModel) => {
  const { loginUser } = require('../controllers/login/login')

  const router = express.Router()
  router.post('/', loginUser)
  return router
}
