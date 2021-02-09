const debug = require('debug')('auth')

class AuthManager {
    constructor (client, tokenStore) {
        this.client = client
        this.tokenStore = tokenStore
    }

    getLoginUrl (redirect_uri) {
        return this.client.authorizeURL({ response_type: 'code', redirect_uri })
    }

    async processCode (code, redirect_uri) {
        const accessToken = await this.client.getToken({ code, redirect_uri })
        await this.tokenStore.set(accessToken)
    }

    async getAccessToken () {
        const tokenJSON = await this.tokenStore.get()
        let accessToken = this.client.createToken(tokenJSON)
        if (accessToken.expired()) {
            debug('token expired')
            accessToken = await accessToken.refresh()
            await this.tokenStore.set(accessToken)
        }
        return accessToken.toJSON().access_token
    }
}


module.exports = AuthManager