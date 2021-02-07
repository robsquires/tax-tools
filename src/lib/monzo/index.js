const TokenStore = require('./token-store')
const { AuthorizationCode } = require('simple-oauth2')
const { dataBucket } = require('../aws')

const {	CLIENT_SECRET, CLIENT_ID } = process.env

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
};
   

module.exports = {
    auth: new AuthorizationCode(oauth2Config),
    tokenStore: new TokenStore(dataBucket),
}