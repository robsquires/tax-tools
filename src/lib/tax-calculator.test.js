const TaxCalculator = require('./tax-calculator')

const bands = [
    [0, 1000, 0],
    [1000, 2000, 0.1],
    [2000, 3000, 0.2],
]

const calculator = new TaxCalculator(bands)

describe('calculateNet', () => {
    test('within first tax band', () => {
        expect(calculator.calculateNet(0, 0)).toEqual(0)
        expect(calculator.calculateNet(200, 10)).toEqual(0)
        expect(calculator.calculateNet(0, 1000)).toEqual(0)
    })

    test('within next tax band', () => {
        // first band
        expect(calculator.calculateNet(1200, 500)).toEqual(50)
    })

    test('straddling multiple tax bands', () => {
        expect(calculator.calculateNet(500, 1000)).toEqual(50)
        expect(calculator.calculateNet(1500, 1000)).toEqual(150)
    })

    test('decimal values', () => {
        expect(calculator.calculateNet(0, 1500.5)).toEqual(50.05)
    })
})

describe('grossUp', () => {
    test('net and gross amount fall within first tax band', () => {
        expect(calculator.grossUp(0, 500)).toEqual(500)
        expect(calculator.grossUp(200, 500)).toEqual(500)
    })

    test('net and gross amount fall within next tax band', () => {
        expect(calculator.grossUp(0, 1500)).toEqual(1555.56)
        expect(calculator.grossUp(200, 1500)).toEqual(1577.78)
    })

    test('net and gross amount straddle tax bands', () => {
        expect(calculator.grossUp(1500, 495)).toEqual(556.25)
    })
})
