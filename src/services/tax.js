const AWS = require('aws-sdk')
const TaxService = require('../tax-service')
const Earnings = require('../earnings')
const Calculator = require('../tax-calculator')
const S3Bucket = require('../s3-bucket')

const bucket = new S3Bucket(new AWS.S3(), 'monzo-tax-collector')

const bands = [
    [0, 2000, 0],
    [2000, 37500, 0.075],
    [37500, 150000, 0.325],
    [150000, 9999999, 0.381] // strictly speaking unlimited
]
const taxYear = '2020-2021'

const calculator = new Calculator(bands)
const earnings = new Earnings(taxYear, bucket)
const tax = new TaxService(calculator, earnings)

module.exports = {
    earnings,
    tax
}