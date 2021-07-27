// include dependencies
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const morgan = require("morgan")

// mount `exampleProxy` in web server
const app = express()


// Proxy endpoints
app.use('/data', morgan('dev'), createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/data`]: '',
    },
 }))

app.listen(3000)