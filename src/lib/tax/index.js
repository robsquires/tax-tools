const TaxService = require('./service')
const Earnings = require('./earnings')
const Calculator = require('./calculator')
const { dataBucket } = require('../aws')

const bands = [
    [0, 2000, 0],
    [2000, 37500, 0.075],
    [37500, 150000, 0.325],
    [150000, 9999999, 0.381] // strictly speaking unlimited
]
const taxYear = '2020-2021'

const calculator = new Calculator(bands)
const earnings = new Earnings(taxYear, dataBucket)
const tax = new TaxService(calculator, earnings)

module.exports = {
    earnings,
    tax
}