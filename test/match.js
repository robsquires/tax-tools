const sample = require('../sample.json');
const matchTransaction = require('../lib/match');


const tests = [
    [
        { 
            'data.counterparty.account_number': '123456',
            'data.counterparty.sort_code': '010101',
            'data.description': 'DIVIDEND'
        },
        true,
        'exact match description'
    ],
    [
        { 
            'data.counterparty.account_number': '123456',
            'data.counterparty.sort_code': '010102',
            'data.description': 'dividend'
        },
        false,
        'bad sort code'
    ],
    [
        { 
            'data.counterparty.account_number': '123456',
            'data.counterparty.sort_code': '010101',
            'data.description': 'dividend'
        },
        false,
        'bad description'
    ],
    [
        { 
            'data.counterparty.account_number': '123456',
            'data.counterparty.sort_code': '010101',
            'data.description': /dividend/
        },
        false,
        'case insentive regex'
    ],
    [
        { 
            'data.counterparty.account_number': '123456',
            'data.counterparty.sort_code': '010101',
            'data.description': /dividend/i
        },
        true,
        'case sentive regex'
    ],
]

const results = tests.map(([ criteria, shouldMatch, reason = '' ]) => {
    if ((!!matchTransaction(sample, criteria)) !== shouldMatch) {
        console.log(`Should ${shouldMatch ? '' : 'not '}match`, criteria);
        console.log('----');
        return reason;
    }
    return 'ok';
});

console.log('Results:', results.toString())