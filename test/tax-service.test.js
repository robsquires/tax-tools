const TaxService = require('../src/tax-service')

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
            const earningsToDate = 2000
            const earnings = 1000
            earningsMock.get.mockResolvedValue(earningsToDate)
            calculatorMock.calculateNet.mockReturnValue(50)

            const taxApplied = await taxService.applyTax(earnings)

            expect(taxApplied).toEqual(50)
            expect(earningsMock.set).toBeCalledWith(earningsToDate + earnings)
            expect(calculatorMock.calculateNet).toBeCalledWith(earningsToDate, earnings)
        })

        test("starts earnings from 0 if it's a new tax year", async () => {
            const earnings = 1000
            earningsMock.get.mockRejectedValue({ statusCode: 404 })
            calculatorMock.calculateNet.mockReturnValue(10)

            const taxApplied = await taxService.applyTax(earnings)

            expect(taxApplied).toEqual(10)
            expect(earningsMock.set).toBeCalledWith(earnings)
            expect(calculatorMock.calculateNet).toBeCalledWith(0, earnings)
        })

        test('rethrows errors from earnings service', async () => {
            const err = new Error('ouch')
            earningsMock.get.mockRejectedValue(err)
            await expect(() => taxService.applyTax(1000)).rejects.toBe(err)
        })
    })

    describe('calculateGrossPayment', () => {
        test('returns gross payment', async () => {
            const earningsToDate = 2000
            const netEarnings = 1000
            earningsMock.get.mockResolvedValue(earningsToDate)
            calculatorMock.grossUp.mockReturnValue(1100)
            const taxApplied = await taxService.calculateGrossPayment(netEarnings)

            expect(taxApplied).toEqual(1100)
            expect(earningsMock.set).not.toBeCalled()
            expect(calculatorMock.grossUp).toBeCalledWith(earningsToDate, netEarnings)
        })

        test('earnings start from zero if a new tax year', async () => {
            const netEarnings = 1000
            earningsMock.get.mockRejectedValue({ statusCode: 404 })
            calculatorMock.grossUp.mockReturnValue(1100)
            const taxApplied = await taxService.calculateGrossPayment(netEarnings)

            expect(taxApplied).toEqual(1100)
            expect(earningsMock.set).not.toBeCalled()
            expect(calculatorMock.grossUp).toBeCalledWith(0, netEarnings)
        })
    })
})
