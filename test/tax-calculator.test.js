const TaxCalculator = require('../src/tax-calculator')

const bands = [
    [0, 2000, 0],
    [2000, 37500, 0.075],
    [37500, 150000, 0.325],
    [150000, 9999999, 0.381], // strictly speaking unlimited
]

const calculator = new TaxCalculator(bands)

test('tax free band', () => {
    expect(calculator.totalTax(0)).toEqual(0)
    expect(calculator.totalTax(10)).toEqual(0)
    expect(calculator.totalTax(2000)).toEqual(0)
})

test('additional tax bands', () => {
    // first band
    expect(calculator.totalTax(3000)).toEqual(75)

    // up to next band
    expect(calculator.totalTax(37500)).toEqual(2662.5)

    // into other bands
    expect(calculator.totalTax(40000)).toEqual(3475)
    expect(calculator.totalTax(160000)).toEqual(43035)
})

test('decimal values', () => {
    expect(calculator.totalTax(3000.5)).toEqual(75.04)
})
