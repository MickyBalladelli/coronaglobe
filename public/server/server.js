// include dependencies
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

// mount `exampleProxy` in web server
const app = express()


// Proxy endpoints
app.use('/data', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/data`]: '',
    },
 }))

app.listen(3000)