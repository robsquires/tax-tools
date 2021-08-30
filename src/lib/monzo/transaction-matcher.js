const matchJSON = require('../utils/match-json')
const debug = require('debug')('transaction-matcher')

class TransactionMatcher {
    constructor(jsonBucket) {
        this.jsonBucket = jsonBucket
    }

    async match(transaction) {
        const rules = await this.jsonBucket.read('rules.json')
        debug('match', rules)
        return matchJSON(transaction, rules)
    }

    async setRules(rules) {
        await this.jsonBucket.write('rules.json', rules)
    }
}

module.exports = TransactionMatcher
