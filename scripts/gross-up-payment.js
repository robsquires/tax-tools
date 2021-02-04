require('dotenv').config()

const {
    earnings,
    tax
} = require('../src/services/tax')

async function main(netAmount) {
    return {
        gross: await tax.calculateGrossPayment(netAmount),
        total: await earnings.get()
    }
}

main(parseFloat(process.argv[2]))
    .then(console.log)
    .catch(console.err)