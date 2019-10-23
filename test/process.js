
const sample = require('../sample.json');
const processTransaction = require('../lib/process');



processTransaction(sample, [
    {
       criteria: { 
            'data.counterparty.account_number': '123456',
            'data.counterparty.sort_code': '010101',
            'data.description': 'DIVIDEND'
        },
        action: {
            potId: 123,
            percentage: 0.3
        }
    }
])