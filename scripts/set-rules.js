require('dotenv').config()
const { transactionMatcher } = require('../src/lib/monzo')

let rules
try {
    rules = require('../.transaction-rules.json')
} catch (err) {
    console.error('Rules not found or not valid JSON, check .transaction-rules.json')
    process.exit(1)
}

console.log('Found rules', rules)

transactionMatcher
    .setRules(rules)
    .then(() => console.log('rules saved'))
    .catch(console.err)
