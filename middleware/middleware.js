// middleware.js
const express = require('express')
const cors = require('cors')
const path = require('path')
const { getFolderPath } = require('../utils/getFolderPath')

const middleware = {}

/* ------------------ Body Parsers ------------------ */

middleware.jsonParser = function () {
  return express.json()
}

middleware.urlencodedParser = function () {
  return express.urlencoded()
}

/* ------------------ Logger ------------------ */

middleware.logger = function ({ showTime = true, prefix = '[LOG]' } = {}) {
  return (req, res, next) => {
    const parts = [prefix, req.method, req.url]
    if (showTime) parts.push(new Date().toISOString())
    console.log(parts.join(' | '))
    next()
  }
}

/* ------------------ CORS ------------------ */

middleware.cors = function () {
  return cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
}

/* ------------------ Static Files ------------------ */

middleware.static = {}

middleware.static.serve = function (folder = 'methods-public') {
  return express.static(getFolderPath(folder))
}

middleware.static.serveFrom = function (moduleDir, folder = 'methods-public') {
  return express.static(path.resolve(moduleDir, folder))
}

middleware.static.serveWithCache = function (
  folder = 'methods-public',
  maxAge = '1d',
) {
  return express.static(getFolderPath(folder), {
    maxAge,
    etag: true,
    immutable: true,
  })
}

middleware.static.serveFile = function (req, res, folder, file) {
  if (!folder || !file) throw new Error('Invalid params')
  return res.sendFile(path.resolve(getFolderPath(folder), file))
}

module.exports = middleware
