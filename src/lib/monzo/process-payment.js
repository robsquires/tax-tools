const debug = require('debug')('process-payment')
const { statuses } = require('./transaction-log')
const { NEW, DEPOSITED, APPLIED } = statuses

function ProcessPayment(tax, transactions, monzo) {
    return async function processPayment(transactionId, potId, accountId) {
        debug('transaction-id', transactionId)
        const transaction = (await transactions.find(transactionId)) || { status: NEW }
        if (transaction && transaction.status === APPLIED) {
            debug('Already processed', transaction)
            return
        }

        const { amount } = await monzo.getTransaction(transactionId)
        debug('amount-in-pence', amount)

        if (amount < 0) {
            throw new Error('Transaction is not a deposit')
        }

        const taxToPay = await tax.calculateTax(amount)

        debug('tax', taxToPay)
        if (transaction.status === NEW) {
            await monzo.depositToPot(taxToPay, potId, accountId)
            transaction.status = DEPOSITED
            transaction.tax = taxToPay
        }

        try {
            await tax.applyTax(amount)
            transaction.status = APPLIED
        } catch (err) {
            await transactions.save(transactionId, transaction)
            throw err
        }

        await transactions.save(transactionId, transaction)
    }
}

module.exports = ProcessPayment
