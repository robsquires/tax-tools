require('dotenv').config()

const { earnings, tax } = require('../src/lib/tax')

async function main(netAmountStr) {
    const netAmount = parseInt(netAmountStr * 100)
    console.log(netAmount)
    return {
        gross: await tax.calculateGrossPayment(netAmount),
        total: await earnings.get(),
    }
}

main(process.argv[2]).then(console.log).catch(console.err)
