'use strict'

const { EventEmitter } = require('events');
const Client = require('./client.js')

const TIME_TO_GATHER = 5000;

function log(msg) {
    process.stderr.write(`AGENT: ${msg}\n`)
}

class CloudMetadataGatherer extends EventEmitter {
    constructor() {
        super()
        this.metadata = null
    }
    start() {
        log('start gathering')
        setTimeout(() => {
            log('done gathering')
            this.metadata = {'thisIsMyCloud': 'there are many like it'}
            this.emit('metadata', this.metadata)
            log('emitted metadata event')
        }, TIME_TO_GATHER)
    }
}

class Agent {
    constructor() {
        this._cloudMetadataGatherer = new CloudMetadataGatherer()
    }
    start(opts) {
        this._transport = new Client({
            metadataGatherer: this._cloudMetadataGatherer
        })
        this._cloudMetadataGatherer.start()
        log('agent started')
        return this
    }
    sendSpan(name) {
        const span = {
            name,
            time: new Date().toISOString()
        }
        log('sending a span')
        this._transport.sendSpan(span)
    }
}


module.exports = new Agent()
