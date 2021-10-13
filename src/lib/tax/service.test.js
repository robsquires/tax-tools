const { when } = require('jest-when')
const TaxService = require('./service')
const Money = require('../utils/money')

const calculatorMock = {
    calculateNet: jest.fn(),
    grossUp: jest.fn(),
}

const earningsMock = {
    get: jest.fn(),
    set: jest.fn(),
}

const taxService = new TaxService(calculatorMock, earningsMock)

describe('tax-service', () => {
    beforeEach(() => {
        calculatorMock.calculateNet.mockReset()
        calculatorMock.grossUp.mockReset()
        earningsMock.get.mockReset()
        earningsMock.set.mockReset()
    })

    describe('applyTax', () => {
        test('applies tax and updates earnings', async () => {
            const earningsToDate = Money.fromPounds(2000)
            const earnings = Money.fromPounds(1000)
            earningsMock.get.mockResolvedValue(earningsToDate)
            when(calculatorMock.calculateNet).calledWith(earningsToDate, earnings).mockReturnValue(5000)

            const taxApplied = await taxService.applyTax(earnings)

            expect(taxApplied).toEqual(5000)
            expect(earningsMock.set).toBeCalled()
            const [newEarnings] = earningsMock.set.mock.calls[0]
            Money.assertInstanceOf(newEarnings)
            // bit naff, but forces valueOf() to be called which makes this assertion a bit easier to read
            expect(newEarnings + 0).toStrictEqual(earningsToDate + earnings)
        })

        test('validated valid money amount', async () => {
            await expect(() => taxService.applyTax('a')).rejects.toBeTruthy()
        })
    })

    describe('calculateGrossPayment', () => {
        test('returns gross payment', async () => {
            const earningsToDate = Money.fromPounds(2000)
            const netEarnings = Money.fromPounds(1000)
            earningsMock.get.mockResolvedValue(earningsToDate)
            calculatorMock.grossUp.mockReturnValue(110000)
            const taxApplied = await taxService.calculateGrossPayment(netEarnings)

            expect(taxApplied).toEqual(110000)
            expect(earningsMock.set).not.toBeCalled()
            expect(calculatorMock.grossUp).toBeCalledWith(earningsToDate, netEarnings)
        })

        test('validated valid money amount', async () => {
            await expect(() => taxService.calculateGrossPayment('a')).rejects.toBeTruthy()
        })
    })

    describe('calculateTax', () => {
        test('calculate and returns tax', async () => {
            const earningsToDate = Money.fromPounds(2000)
            const earnings = Money.fromPounds(1000)
            earningsMock.get.mockResolvedValue(earningsToDate)
            when(calculatorMock.calculateNet).calledWith(earningsToDate, earnings).mockReturnValue(5000)

            const tax = await taxService.calculateTax(earnings)
            expect(tax).toEqual(5000)
            expect(earningsMock.set).not.toBeCalled()
        })

        test('validated valid money amount', async () => {
            await expect(() => taxService.calculateTax('a')).rejects.toBeTruthy()
        })
    })

    describe('currentTaxLiability', () => {
        test('returns tax owed based on what you`ve earned this year', async () => {
            const earningsToDate = Money.fromPounds(2000)
            earningsMock.get.mockResolvedValue(earningsToDate)
            when(calculatorMock.calculateNet).calledWith(0, earningsToDate).mockReturnValue(500)
            const tax = await taxService.currentTaxLiability()
            expect(tax).toEqual(500)
        })
    })
})
