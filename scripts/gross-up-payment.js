require('dotenv').config()

const { earnings, tax } = require('../src/lib/tax')
const Money = require('../src/lib/utils/money')
async function main(netAmountStr) {
    const amount = Money.fromPounds(netAmountStr)
    return {
        net: Money.toPounds(amount),
        gross: Money.toPounds(await tax.calculateGrossPayment(amount)),
        totalTax: Money.toPounds(await earnings.get()),
    }
}

main(process.argv[2]).then(console.log).catch(console.err)
