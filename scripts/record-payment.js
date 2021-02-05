require('dotenv').config()

const { tax, earnings } = require('../src/lib/tax')

async function main(amount) {
    return {
        applied: await tax.applyTax(amount),
        total: await earnings.get(),
    }
}

main(parseFloat(process.argv[2])).then(console.log).catch(console.err)
