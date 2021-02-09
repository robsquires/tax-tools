const Earnings = require('./earnings')

const s3Bucket = {
    read: jest.fn(),
    write: jest.fn(),
}

const taxYear = '2020-2021'
const earnings = new Earnings(taxYear, s3Bucket)

describe('earnings', () => {
    describe('get', () => {
        test('returns earnings for the tax year', async () => {
            s3Bucket.read.mockResolvedValue({ total: 100 })
            expect(await earnings.get()).toEqual(100)
        })

        test('returns 0 if earnings not found in bucket', async () => {
            s3Bucket.read.mockRejectedValue({ statusCode: 404 })
            expect(await earnings.get()).toEqual(0)
        })

        test('rethrows other errors', async () => {
            const error = { statusCode: 500 }
            s3Bucket.read.mockRejectedValue(error)
            await expect(earnings.get()).rejects.toEqual(error)
        })
    })
})
