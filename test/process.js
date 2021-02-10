require('dotenv').config()
const sample = require('../sample.json')
const processTransaction = require('../lib/process')

const { ACC_ID, POT_ID } = process.env

processTransaction(
    sample,
    [
        {
            criteria: {
                'data.counterparty.account_number': '123456',
                'data.counterparty.sort_code': '010101',
                'data.description': 'DIVIDEND',
            },
            action: {
                potId: POT_ID,
                percentage: 1.5,
            },
        },
    ],
    ACC_ID,
)
