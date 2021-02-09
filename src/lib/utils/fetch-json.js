const fetch = require('node-fetch')
const createError = require('http-errors')

/**
 * Useful reference for fetch errors
 * https://github.com/node-fetch/node-fetch/blob/master/docs/ERROR-HANDLING.md
 */

async function fetchJson(...args) {
    // network, DNS other operational errors thrown here
    const response = await fetch(...args)
    const bodyText = await response.text()
    let body
    try {
        // non-json responses common when server unavailable
        body = JSON.parse(bodyText)
    } catch (err) {
        // catch the body can be logged
        body = bodyText
    }

    if (!response.ok) {
        // log body in-case contains useful info
        console.log(body)
        // convert to http-error
        throw createError(response.status)
    }

    return body
}

module.exports = fetchJson
