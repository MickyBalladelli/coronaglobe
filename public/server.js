// to use:
// node build/server/server.js

const express = require('express')
const { createProxy } = require('http-proxy-middleware')
const morgan = require("morgan")

const app = express()

// from https://github.com/owid/covid-19-data

app.use('/owid', morgan('dev'), createProxy({
  target: 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest',
  changeOrigin: true,
  pathRewrite: {
    [`^/owid`]: '',
  },
}))

app.use('/', morgan('dev'), express.static(__dirname))
app.listen(3000)