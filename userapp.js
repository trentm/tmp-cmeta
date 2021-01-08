'use strict'

var apm = require('./agent').start()
const http = require('http')

function log(msg) {
    process.stderr.write(`USERAPP: ${msg}\n`)
}


function setup() {
    const server = http.createServer(function handle (req, res) {
        apm.sendSpan('handled request')
        res.end('hi')
    })
    server.listen(3000, () => {
        log('listening at http://localhost:3000')
    })

    // My lazy APM API to manually send a span soon, before cloud metadata
    // gathering will be done.
    log('sending span')
    apm.sendSpan('setup')
}

setup()

