const { AuthorizationCode } = require('simple-oauth2')
const TokenStore = require('./token-store')
const { dataBucket } = require('../aws')
const AuthManager = require('./manager')

const { CLIENT_SECRET, CLIENT_ID } = process.env

const oauth2Config = {
    client: { id: CLIENT_ID, secret: CLIENT_SECRET },
    auth: {
        authorizeHost: 'https://auth.monzo.com',
        authorizePath: '/',
        tokenHost: 'https://api.monzo.com',
        tokenPath: '/oauth2/token',
    },
    options: {
        authorizationMethod: 'body',
    },
    http: {
        json: 'strict',
    },
}

const client = new AuthorizationCode(oauth2Config)
const tokenStore = new TokenStore(dataBucket)

module.exports = new AuthManager(client, tokenStore)
