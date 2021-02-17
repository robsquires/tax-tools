const matchJSON = require('./match-json')

const rules = {
    '/counterparty/account_number': ['eq', '123456'],
    '/counterparty/sort_code': ['eq', '010101'],
}

test('return true when all properties match', () => {
    const data = {
        counterparty: {
            account_number: '123456',
            sort_code: '010101',
            country: 'UK',
        },
    }
    expect(matchJSON(data, rules)).toBeTruthy()
})

test('return false when one or more properties do not match', () => {
    const data = {
        counterparty: {
            account_number: '123456',
            sort_code: '020202',
            country: 'UK',
        },
    }
    expect(matchJSON(data, rules)).toBeFalsy()
})

test('returns false when a property does not exist in data', () => {
    const data = {
        counterparty: {
            account_number: '123456',
            country: 'UK',
        },
    }
    expect(matchJSON(data, rules)).toBeFalsy()
})

describe('regex matcher', () => {
    const data = {
        counterparty: {
            account_number: '123456',
            reference: 'test transaction',
        },
    }

    test('returns true when regex matches', () => {
        const rules = {
            '/counterparty/reference': ['regex', 'test'],
        }
        expect(matchJSON(data, rules)).toBeTruthy()
    })

    test('returns false when regex does not match', () => {
        const rules = {
            '/counterparty/reference': ['regex', 'real transaction'],
        }
        expect(matchJSON(data, rules)).toBeFalsy()
    })

    test('supports regex flags', () => {
        const rules = {
            '/counterparty/reference': ['regex', 'TEST', 'i'],
        }
        expect(matchJSON(data, rules)).toBeTruthy()
    })
})

describe('greater-than matcher', () => {
    const data = {
        amount: 1,
    }

    test('match', () => {
        const rules = {
            '/amount': ['gt', 0],
        }
        expect(matchJSON(data, rules)).toBeTruthy()
    })

    test('does not match', () => {
        const rules = {
            '/amount': ['gt', 1],
        }
        expect(matchJSON(data, rules)).toBeFalsy()
    })
})
