const fetch = require('../utils/fetch-json')
const qs = require('qs')

class MonzoHttpClient {
    constructor(host, auth) {
        this.host = host
        this.auth = auth
    }

    async get({ path, params = {} }) {
        return await fetch(`${this.host}/${path}?${qs.stringify(params)}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${await this.auth.getAccessToken()}`,
            },
        })
    }

    async post({ path, data }) {
        return await fetch(`${this.host}/${path}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: `Bearer ${await this.auth.getAccessToken()}`,
            },
            body: qs.stringify(data),
        })
    }

    async put({ path, data }) {
        return await fetch(`${this.host}/${path}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: `Bearer ${await this.auth.getAccessToken()}`,
            },
            body: qs.stringify(data),
        })
    }

    async delete({ path }) {
        return await fetch(`${this.host}/${path}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${await this.auth.getAccessToken()}`,
            },
        })
    }
}

module.exports = MonzoHttpClient
