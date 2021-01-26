require('dotenv').config()
const AWS = require('aws-sdk')
const TaxService = require('../src/tax-service')
const Earnings = require('../src/earnings')
const Calculator = require('../src/tax-calculator')
const S3Bucket = require('../src/s3-bucket')

const bands = [
    [0, 2000, 0],
    [2000, 37500, 0.075],
    [37500, 150000, 0.325],
    [150000, 9999999, 0.381] // strictly speaking unlimited
]
const taxYear = '2020-2021'

const calculator = new Calculator(bands)

const taxBucket = new S3Bucket(new AWS.S3(), 'monzo-tax-collector')
const earnings = new Earnings(taxYear, taxBucket)

const taxService = new TaxService(calculator, earnings)

async function main() {
    return {
        applied: await taxService.applyTax(10000),
        total: await earnings.get()
    }
}


main()
    .then(console.log)
    .catch(console.err)