const { when } = require('jest-when')
const { TransactionLog } = require('./transaction-log')
const mockBucket = {
    read: jest.fn(),
    write: jest.fn(),
}

const taxYear = '2020-2021'
const transactionLog = new TransactionLog(taxYear, mockBucket)

const transactions = [{ id: 'abc-1' }, { id: 'abc-2' }, { id: 'abc-3' }]

describe('transaction-log', () => {
    beforeEach(() => {
        mockBucket.read.mockReset()
        mockBucket.write.mockReset()
    })

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

    describe('save', () => {
        test('saves a new transaction', async () => {
            when(mockBucket.read)
                .calledWith(`${taxYear}/transactions.json`)
                .mockResolvedValue([...transactions])
            await transactionLog.save('abc-4', { status: 1 })
            expect(mockBucket.write).toBeCalledWith(`${taxYear}/transactions.json`, [
                ...transactions,
                { status: 1, id: 'abc-4' },
            ])
        })

        test('saves an existing transaction', async () => {
            when(mockBucket.read)
                .calledWith(`${taxYear}/transactions.json`)
                .mockResolvedValue([...transactions])

            await transactionLog.save('abc-3', { status: 1 })

            expect(mockBucket.write).toBeCalledWith(`${taxYear}/transactions.json`, [
                ...transactions.slice(0, 2),
                { status: 1, id: 'abc-3' },
            ])
        })
    })
})
