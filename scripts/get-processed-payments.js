require('dotenv').config()

const Monzo = require('../src/lib/monzo')

Monzo.processedPayments().then(console.log).catch(console.error)
