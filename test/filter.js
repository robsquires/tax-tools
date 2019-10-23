const sample = require('../sample.json');
const filterTransaction = require('../lib/filter');


const tests = [
    [
        { 
            'counterparty.account_number': '123456',
            'counterparty.sort_code': '010101',
            'description': 'DIVIDEND'
        },
        true,
        'exact match description'
    ],
    [
        { 
            'counterparty.account_number': '123456',
            'counterparty.sort_code': '010102',
            'description': 'dividend'
        },
        false,
        'bad sort code'
    ],
    [
        { 
            'counterparty.account_number': '123456',
            'counterparty.sort_code': '010101',
            'description': 'dividend'
        },
        false,
        'bad description'
    ],
    [
        { 
            'counterparty.account_number': '123456',
            'counterparty.sort_code': '010101',
            'description': /dividend/
        },
        false,
        'case insentive regex'
    ],
    [
        { 
            'counterparty.account_number': '123456',
            'counterparty.sort_code': '010101',
            'description': /dividend/i
        },
        true,
        'case sentive regex'
    ],
]

const results = tests.map(([ criteria, shouldMatch, reason = '' ]) => {
    if ((!!filterTransaction(sample, criteria)) !== shouldMatch) {
        console.log(`Should ${shouldMatch ? '' : 'not '}match`, criteria);
        console.log('----');
        return reason;
    }
    return 'ok';
});

console.log('Results:', results.toString())