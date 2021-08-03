// to use:
// node build/server.js

const express = require('express')
const morgan = require("morgan")

const app = express()
console.log('Starting node server..')

app.use('/', morgan('dev'), express.static(__dirname))
app.listen(16995)