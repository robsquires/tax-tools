const { tax, taxYear } = require('../tax')
const { dataBucket } = require('../aws')
const Auth = require('../auth')
const HttpClient = require('./http')
const MonzoClient = require('./client')
const { TransactionLog } = require('./transaction-log')
const ProcessPayment = require('./process-payment')
const TransactionMatcher = require('./transaction-matcher')

const transactionLog = new TransactionLog(taxYear, dataBucket)
const http = new HttpClient('https://api.monzo.com', Auth)
const monzoClient = new MonzoClient(http)
const transactionMatcher = new TransactionMatcher(dataBucket)

module.exports = {
    processPayment: ProcessPayment(tax, transactionLog, monzoClient),
    transactionMatcher,
    processedPayments: () => transactionLog.get(),
    client: monzoClient,
}
