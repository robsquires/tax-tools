const TaxService = require('./service')

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

        test('validated valid money amount', async () => {
            await expect(() => taxService.calculateGrossPayment('a')).rejects.toBeTruthy()
        })
    })
})
