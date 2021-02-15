require('dotenv').config()

const { tax, earnings } = require('../src/lib/tax')
const Money = require('../src/lib/utils/money')
async function main(amount) {
    return {
        applied: Money.toPounds(await tax.applyTax(Money.fromPounds(amount))),
        total: Money.toPounds(await earnings.get()),
    }
}

main(process.argv[2]).then(console.log).catch(console.err)
