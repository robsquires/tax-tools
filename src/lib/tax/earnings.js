const Money = require('../utils/money')
class Earnings {
    constructor(taxYear, s3Bucket) {
        this.taxYear = taxYear
        this.s3Bucket = s3Bucket
    }

    async get() {
        try {
            return Money.fromPence((await this.s3Bucket.read(`${this.taxYear}/earnings.json`)).total)
        } catch (err) {
            if (err.statusCode === 404) {
                return Money.fromPence(0)
            }
            throw err
        }
    }

    async set(amount) {
        Money.assertInstanceOf(amount)
        return await this.s3Bucket.write(`${this.taxYear}/earnings.json`, { total: amount })
    }
}

module.exports = Earnings
