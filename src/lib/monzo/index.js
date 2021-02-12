const { tax, taxYear } = require('../tax')
const { dataBucket } = require('../aws')
const Auth = require('../auth')
const HttpClient = require('./http')
const MonzoClient = require('./client')
const { TransactionLog } = require('./transaction-log')
const ProcessPayment = require('./process-payment')

const transactionLog = new TransactionLog(taxYear, dataBucket)
const http = new HttpClient('https://api.monzo.com', Auth)
const monzoClient = new MonzoClient(http)

module.exports = {
    processPayment: ProcessPayment(tax, transactionLog, monzoClient),
}
