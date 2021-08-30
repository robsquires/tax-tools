require('dotenv').config()

const { calculator } = require('../src/lib/tax')
const Money = require('../src/lib/utils/money')

async function main(amountInPounds) {
    return Money.toPounds(calculator.calculateNet(0, Money.fromPounds(amountInPounds)))
}

main(process.argv[2]).then(console.log).catch(console.error)
