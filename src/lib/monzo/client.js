const debug = require('debug')('monzo-client')

class MonzoClient {
    constructor(httpClient) {
        this.httpClient = httpClient
    }

    async getTransaction(id) {
        debug('getTransaction', id)
        return (
            await this.httpClient.get({
                path: `/transactions/${id}`,
            })
        ).transaction
    }

    async depositToPot(amount, potId, accountId) {
        debug('depositToPot', amount, potId, accountId)
        await this.httpClient.put({
            path: `/pots/${potId}/deposit`,
            data: {
                source_account_id: accountId,
                amount,
                dedupe_id: Date.now(),
            },
        })
    }

    async writeToFeed(feedItem, accountId) {
        debug('writeToFeed', feedItem, accountId)
        await this.httpClient.post({
            path: `/feed`,
            data: {
                account_id: accountId,
                type: 'basic',
                params: feedItem,
            },
        })
    }

    async registerWebhook(url, accountId) {
        debug('registerWebhook', url, accountId)
        await this.httpClient.post({
            path: `/webhooks`,
            data: {
                account_id: accountId,
                url,
            },
        })
    }
    async listWebhooks(accountId) {
        debug('listWebhooks', accountId)
        return await this.httpClient.get({
            path: `/webhooks`,
            params: {
                account_id: accountId,
            },
        })
    }

    async deleteWebhook(id) {
        debug('deleteWebhook', id)
        await this.httpClient.delete({
            path: `/webhooks/${id}`,
        })
    }
}

module.exports = MonzoClient
