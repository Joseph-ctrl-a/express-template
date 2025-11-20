const error = require('../operations/error')
module.exports = app =>
  app.use((err, req, res, next) => {
    console.error(err)
    return error.throwCustom(res, err)
  })
