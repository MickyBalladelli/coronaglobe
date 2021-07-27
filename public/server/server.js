// include dependencies
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const morgan = require("morgan")

// mount `exampleProxy` in web server
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

app.listen(3000)