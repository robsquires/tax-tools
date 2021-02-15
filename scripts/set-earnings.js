require('dotenv').config()

const { earnings } = require('../src/lib/tax')
const Money = require('../src/lib/utils/money')
async function main(amount) {
    await earnings.set(Money.fromPounds(amount))
    return {
        total: Money.toPounds(await earnings.get()),
    }
}

main(process.argv[2]).then(console.log).catch(console.err)
