const Earnings = require('./earnings')
const Money = require('../utils/money')
const s3Bucket = {
    read: jest.fn(),
    write: jest.fn(),
}

const taxYear = '2020-2021'
const earnings = new Earnings(taxYear, s3Bucket)

describe('earnings', () => {
    describe('get', () => {
        test('returns earnings for the tax year', async () => {
            s3Bucket.read.mockResolvedValue({ total: 10000 })
            const amount = await earnings.get()
            expect(amount).toEqual(10000)
        })

        test('returns 0 if earnings not found in bucket', async () => {
            s3Bucket.read.mockRejectedValue({ statusCode: 404 })
            const amount = await earnings.get()
            expect(amount).toEqual(0)
        })

        test('rethrows other errors', async () => {
            const error = { statusCode: 500 }
            s3Bucket.read.mockRejectedValue(error)
            await expect(earnings.get()).rejects.toEqual(error)
        })
    })

    describe('set', () => {
        test('sets earnings for the tax year', async () => {
            await earnings.set(Money.fromPounds(100.1))
            expect(s3Bucket.write).toBeCalledWith('2020-2021/earnings.json', { total: 10010 })
        })

        test('throws if money is not passed in', async () => {
            await expect(earnings.set(100.1)).rejects.toBeTruthy()
        })
    })
})
