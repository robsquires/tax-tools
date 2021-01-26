class Earnings {
    constructor(taxYear, s3Bucket) {
        this.taxYear = taxYear
        this.s3Bucket = s3Bucket
    }

    async get() {
        const { total } = await this.s3Bucket.read(`${this.taxYear}/earnings.json`)
        return total
    }

    async set(amount) {
        return await this.s3Bucket.write(`${this.taxYear}/earnings.json`, { total: amount })
    }
}

module.exports = Earnings
