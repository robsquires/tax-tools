/* eslint-disable jest/expect-expect */
const { when } = require('jest-when')
const { statuses } = require('./transaction-log')
const { DEPOSITED, APPLIED } = statuses

const taxMock = {
    calculateTax: jest.fn(),
    applyTax: jest.fn(),
}

const transactionLogMock = {
    find: jest.fn(),
    save: jest.fn(),
}

const monzoMock = {
    getTransaction: jest.fn(),
    depositToPot: jest.fn(),
}

const ProcessPayment = require('./process-payment')
const processPayment = ProcessPayment(taxMock, transactionLogMock, monzoMock)

describe('process-payment', () => {
    const potId = 'pot_123'
    const accId = 'acc_def'
    const transactionAmount = 10000
    const taxAmount = 1000

    beforeEach(() => {
        transactionLogMock.find.mockReset()
        transactionLogMock.save.mockReset()
        monzoMock.depositToPot.mockReset()
        taxMock.applyTax.mockReset()
    })

    test('processes a new transaction', async () => {
        when(transactionLogMock.find).calledWith('1234').mockResolvedValue()
        when(monzoMock.getTransaction).calledWith('1234').mockResolvedValue({ amount: transactionAmount })
        when(taxMock.calculateTax).calledWith(transactionAmount).mockResolvedValue(taxAmount)
        await processPayment('1234', potId, accId)

        expect(monzoMock.depositToPot).toBeCalledWith(taxAmount, potId, accId)
        expect(taxMock.applyTax).toBeCalledWith(transactionAmount)
        expect(transactionLogMock.save).toBeCalledWith('1234', { status: APPLIED, tax: taxAmount })
    })

    test('processes a transaction which has already been deposited', async () => {
        when(transactionLogMock.find).calledWith('1234').mockResolvedValue({ status: DEPOSITED, tax: taxAmount })
        when(monzoMock.getTransaction).calledWith('1234').mockResolvedValue({ amount: transactionAmount })
        when(taxMock.calculateTax).calledWith(transactionAmount).mockResolvedValue(taxAmount)
        await processPayment('1234', potId, accId)

        expect(monzoMock.depositToPot).not.toBeCalled()
        expect(taxMock.applyTax).toBeCalledWith(transactionAmount)
        expect(transactionLogMock.save).toBeCalledWith('1234', { status: APPLIED, tax: taxAmount })
    })

    test('does not attempt to deposit to pot if no tax due', async () => {
        when(transactionLogMock.find).calledWith('1234').mockResolvedValue()
        when(monzoMock.getTransaction).calledWith('1234').mockResolvedValue({ amount: transactionAmount })
        when(taxMock.calculateTax).calledWith(transactionAmount).mockResolvedValue(0)
        await processPayment('1234', potId, accId)

        expect(monzoMock.depositToPot).not.toBeCalled()
        expect(taxMock.applyTax).toBeCalledWith(transactionAmount)
        expect(transactionLogMock.save).toBeCalledWith('1234', { status: APPLIED, tax: 0 })
    })

    test('skips a transaction which has already been applied', async () => {
        when(transactionLogMock.find).calledWith('1234').mockResolvedValue({ status: APPLIED })
        await processPayment('1234', potId, accId)

        expect(monzoMock.depositToPot).not.toBeCalled()
        expect(taxMock.applyTax).not.toBeCalled()
    })

    test('fails to deposit tax', async () => {
        const depositError = new Error('Could not deposit')
        when(transactionLogMock.find).calledWith('1234').mockResolvedValue()
        when(monzoMock.getTransaction).calledWith('1234').mockResolvedValue({ amount: transactionAmount })
        when(taxMock.calculateTax).calledWith(transactionAmount).mockResolvedValue(taxAmount)
        monzoMock.depositToPot.mockRejectedValue(depositError)
        await expect(() => processPayment('1234')).rejects.toEqual(depositError)
    })

    test('fails to apply tax', async () => {
        const applyError = new Error('Could not apply tax')
        when(transactionLogMock.find).calledWith('1234').mockResolvedValue()
        when(monzoMock.getTransaction).calledWith('1234').mockResolvedValue({ amount: transactionAmount })
        when(taxMock.calculateTax).calledWith(transactionAmount).mockResolvedValue(taxAmount)
        taxMock.applyTax.mockRejectedValue(applyError)
        await expect(() => processPayment('1234', potId, accId)).rejects.toEqual(applyError)

        expect(transactionLogMock.save).toBeCalledWith('1234', { status: DEPOSITED, tax: taxAmount })
    })

    test('errors when a transaction is not a deposit', async () => {
        when(transactionLogMock.find).calledWith('1234').mockResolvedValue()
        when(monzoMock.getTransaction).calledWith('1234').mockResolvedValue({ amount: -10 })
        await expect(() => processPayment('1234', potId, accId)).rejects.toBeTruthy()

        expect(monzoMock.depositToPot).not.toBeCalledWith()
        expect(taxMock.applyTax).not.toBeCalledWith()
        expect(transactionLogMock.save).not.toBeCalledWith()
    })
})
