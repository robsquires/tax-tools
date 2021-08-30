require('dotenv').config()
const { client } = require('../src/lib/monzo')
const matchJSON = require('../src/lib/utils/match-json')

let rules
try {
    rules = require('../.transaction-rules.json')
} catch (err) {
    console.error('Rules not found or not valid JSON, check .transaction-rules.json')
    process.exit(1)
}
const { ACC_ID } = process.env

async function main(transactionId) {
    const transaction = await client.getTransaction(transactionId, ACC_ID)
    console.log(transaction)
    if (!(await matchJSON(transaction, rules))) {
        throw new Error('No match')
    }

    return 'Match'
}

main(process.argv[2]).then(console.log).catch(console.error)
