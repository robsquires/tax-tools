class TransactionLog {
    constructor(taxYear, s3Bucket) {
        this.taxYear = taxYear
        this.s3Bucket = s3Bucket
    }

    async get() {
        try {
            return await this.s3Bucket.read(`${this.taxYear}/transactions.json`)
        } catch (err) {
            if (err.statusCode === 404) {
                return []
            }
            throw err
        }
    }

    async set(transactions) {
        await this.s3Bucket.write(`${this.taxYear}/transactions.json`, transactions)
    }

    async find(transactionId) {
        return (await this.get()).find(({ id }) => transactionId === id)
    }

    async add(transactionId, data) {
        const transactions = await this.get()
        transactions.push({ id: transactionId, ts: new Date(), ...data })
        await this.set(transactions)
    }
}

module.exports = {
    TransactionLog,
    statuses: {
        NEW: 0,
        DEPOSITED: 1,
        APPLIED: 2,
    },
}
