require('dotenv').config()

const services = require('../src/lib/tax')
const Money = require('../src/lib/utils/money')
async function main() {
    const earnings = await services.earnings.get()
    return {
        earnings: Money.toPounds(earnings),
        net: Money.toPounds(await services.tax.currentTaxLiability()),
    }
}

main(process.argv[2]).then(console.log).catch(console.err)
