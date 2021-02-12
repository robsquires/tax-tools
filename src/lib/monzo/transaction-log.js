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

    async save(transactionId, data) {
        const transactions = await this.get()
        const idx = transactions.findIndex(({ id }) => transactionId === id)

        if (idx >= 0) {
            transactions[idx] = { id: transactionId, ...data }
        } else {
            transactions.push({ id: transactionId, ...data })
        }
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
