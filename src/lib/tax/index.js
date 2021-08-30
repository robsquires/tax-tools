const TaxService = require('./service')
const Earnings = require('./earnings')
const Calculator = require('./calculator')
const { dataBucket } = require('../aws')

const bands = [
    [200000, 0],
    [3750000, 0.075],
    [15000000, 0.325],
    [999999999, 0.381], // strictly speaking unlimited
]
const taxYear = '2020-2021'

const calculator = new Calculator(bands)
const earnings = new Earnings(taxYear, dataBucket)
const tax = new TaxService(calculator, earnings)

module.exports = {
    earnings,
    tax,
    taxYear,
    calculator,
}
