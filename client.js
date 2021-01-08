'use strict'

function log(msg) {
    process.stderr.write(`CLIENT: ${msg}\n`)
}

class Client {
    constructor(config) {
        this._conf = config
        this._metadata = null
        this._encodedMetadata = null
        this._conf.metadataGatherer.once('metadata', this._setMetadata)
    }
    _setMetadata(metadata) {
        if (!this._metadata) {
            this._metadata = metadata
            // Actually calls <client>._encode().
            this._encodedMetadata = JSON.stringify(this._metadata) + '\n'
        }
    }
    _getEncodedMetadata(cb) {
        if (this._encodedMetadata) {
            cb(null, this._encodedMetadata)
        } else {
            this._conf.metadataGatherer.once('metadata', (metadata) => {
                this._setMetadata(metadata)
                cb(null, this._encodedMetadata)
            })
            // Could consider a timeout option and callback with an error if
            // hitting that timeout. However, I assume the CloudMetadataGatherer
            // will guarantee it completes within a certain amount of time.
        }
    }
    sendSpan(span) {
        sendAThing(this, this.onError, JSON.stringify(span) + '\n')
    }
    onError(err) {
        log(`onError(${err}`)
        // this.emit('request-error', err)
    }

}

// This in place of `function onStream` in the real client.
function sendAThing(client, onError, thing) {
    let stream = process.stdout // instead of an HTTP req to APM server

    client._getEncodedMetadata((err, encMetadata) => {
        log('got encoded metadata')
        if (err) {
            onError(err)
            return
        }

        stream.write(encMetadata)
        stream.write(thing)
    })
}

module.exports = Client
