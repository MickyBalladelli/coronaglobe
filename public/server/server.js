// to use:
// node build/server/server.js

const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const morgan = require("morgan")
const path = require('path')

const app = express()

const SERVICE_URL = 'https://www.data.gouv.fr/fr/datasets/r/19a91d64-3cd3-42fc-9943-d635491a4d76'

// Proxy endpoints
app.use('/data', morgan('dev'), createProxyMiddleware({
  target: SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    [`^/data`]: '',
  },
}))

// Static server relative to path build/server/../
app.use('/', morgan('dev'), express.static(path.join(__dirname, '..')))
app.listen(3000)