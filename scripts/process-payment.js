require('dotenv').config()

const { POT_ID, ACC_ID } = process.env
const Monzo = require('../src/lib/monzo')

const txId = 'tx_0000A4Ih1lMs2bSFFVAsJF'

Monzo.processPayment(txId, POT_ID, ACC_ID).then(console.log).catch(console.error)
