require('dotenv').config()

const { earnings } = require('../src/lib/tax')

async function main(amount) {
    await earnings.set(amount)
    return {
        total: await earnings.get(),
    }
}

main(parseInt(process.argv[2])).then(console.log).catch(console.err)
