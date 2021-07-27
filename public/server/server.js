// to use:
// node build/server/server.js

const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const morgan = require("morgan")
const path = require('path')

const app = express()

const SERVICE_URL = 'https://www.data.gouv.fr/fr/datasets/r'
const STATIC_DATA = 'https://static.data.gouv.fr'
// Proxy endpoints
app.use('/data', morgan('dev'), createProxyMiddleware({
  target: SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    [`^/data`]: '',
  },
}))
app.use('/staticdata', morgan('dev'), createProxyMiddleware({
  target: STATIC_DATA,
  changeOrigin: true,
  pathRewrite: {
    [`^/staticdata`]: '',
  },
}))


// Static server relative to path build/server/../
app.use('/', morgan('dev'), express.static(path.join(__dirname, '..')))
app.listen(3000)