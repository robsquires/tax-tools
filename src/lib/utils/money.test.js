const money = require('./money')

describe('parse', () => {

    test('returns valid amounts', () => {
        expect(money.parse(1)).toBe(1.00)
        expect(money.parse(0.99)).toBe(0.99)
        expect(money.parse(1.10)).toBe(1.10)
    })

    test('rounds to nearest pence', () => {
        expect(money.parse(0.999)).toBe(1)
        expect(money.parse(1.199)).toBe(1.20)
    })

    test('throws for non-numeric', () => {
        expect(() => money.parse('a')).toThrow()
        expect(() => money.parse('1')).toThrow()
        expect(() => money.parse({})).toThrow()
    })

    test('throws for negative numbers', () => {
        expect(() => money.parse(-1)).toThrow()
    })
})