require('dotenv').config()

const {
    earnings
} = require('../src/services/tax')

async function main(amount) {
    await earnings.set(amount)
    return {
        total: await earnings.get()
    }
}

main(parseFloat(process.argv[2]))
    .then(console.log)
    .catch(console.err)