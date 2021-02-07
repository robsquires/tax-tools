class TokenStore {
    constructor (s3Bucket) {
        this.s3Bucket = s3Bucket
    }

    async get() {
        return await this.s3Bucket.read('access-token.json')
    }

    async set (token) {
        await this.s3Bucket.write('access-token.json', token)
    }
}

module.exports = TokenStore