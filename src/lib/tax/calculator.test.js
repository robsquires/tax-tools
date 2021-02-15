const TaxCalculator = require('./calculator')

const bands = [
    [0, 100000, 0],
    [1000, 200000, 0.1],
    [2000, 300000, 0.2],
]

const calculator = new TaxCalculator(bands)

describe('calculateNet', () => {
    test('within first tax band', () => {
        expect(calculator.calculateNet(0, 0)).toEqual(0)
        expect(calculator.calculateNet(20000, 1000)).toEqual(0)
        expect(calculator.calculateNet(0, 100000)).toEqual(0)
    })

    test('within next tax band', () => {
        // first band
        expect(calculator.calculateNet(120000, 50000)).toEqual(5000)
    })

    test('straddling multiple tax bands', () => {
        expect(calculator.calculateNet(50000, 100000)).toEqual(5000)
        expect(calculator.calculateNet(150000, 100000)).toEqual(15000)
    })

    test('decimal values', () => {
        expect(calculator.calculateNet(0, 150050)).toEqual(5005)
    })
})

describe('grossUp', () => {
    test('net and gross amount fall within first tax band', () => {
        expect(calculator.grossUp(0, 50000)).toEqual(50000)
        expect(calculator.grossUp(20000, 50000)).toEqual(50000)
    })

    test('net and gross amount fall within next tax band', () => {
        expect(calculator.grossUp(0, 150000)).toEqual(155556)
        expect(calculator.grossUp(20000, 150000)).toEqual(157778)
    })

    test('net and gross amount straddle tax bands', () => {
        expect(calculator.grossUp(150000, 49500)).toEqual(55625)
    })
})
