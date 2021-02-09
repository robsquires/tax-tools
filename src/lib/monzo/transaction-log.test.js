const { when } = require('jest-when')
const TransactionLog = require('./transaction-log')
const mockBucket = {
    read: jest.fn(),
    write: jest.fn(),
}

const taxYear = '2020-2021'
const transactionLog = new TransactionLog(taxYear, mockBucket)

const transactions = [{ id: 'abc-1' }, { id: 'abc-2' }, { id: 'abc-23' }]

describe('transaction-log', () => {
    describe('find', () => {
        test('returns a transaction if found', async () => {
            when(mockBucket.read).calledWith(`${taxYear}/transactions.json`).mockResolvedValue(transactions)
            expect(await transactionLog.find('abc-2')).toEqual(transactions[1])
        })

        test('returns undefined if transaction not found', async () => {
            when(mockBucket.read).calledWith(`${taxYear}/transactions.json`).mockResolvedValue([])
            expect(await transactionLog.find('abc-2')).toBeFalsy()
        })

        test('returns undefined no transactions in the tax year', async () => {
            when(mockBucket.read).calledWith(`${taxYear}/transactions.json`).mockRejectedValue({ statusCode: 404 })
            expect(await transactionLog.find('abc-2')).toBeFalsy()
        })
    })
})
