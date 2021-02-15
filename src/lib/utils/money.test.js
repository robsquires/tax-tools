const Money = require('./money')

describe('Money', () => {
    describe('fromPence', () => {
        test('from int', () => {
            expect(Money.fromPence(101)).toBe(101)
        })

        test('from string', () => {
            expect(Money.fromPence('101')).toBe(101)
        })

        test('throws if decimal value', () => {
            expect(() => Money.fromPence(10.1)).toThrow()
            expect(() => Money.fromPence('10.1')).toThrow()
        })

        test('throws for non-numeric', () => {
            expect(() => Money.fromPence('a')).toThrow()
            expect(() => Money.fromPence({})).toThrow()
        })

        test('throws for negative numbers', () => {
            expect(() => Money.fromPence(-1)).toThrow()
        })
    })

    describe('fromPounds', () => {
        test('from int', () => {
            expect(Money.fromPounds(1)).toBe(100)
            expect(Money.fromPounds(1.0)).toBe(100)
        })

        test('from decimal number', () => {
            expect(Money.fromPounds(1.01)).toBe(101)
            expect(Money.fromPounds(1.015)).toBe(102)
        })

        test('from string', () => {
            expect(Money.fromPounds('1')).toBe(100)
            expect(Money.fromPounds('1.0')).toBe(100)
            expect(Money.fromPounds('1.01')).toBe(101)
        })
    })

    test('assertInstanceOf', () => {
        expect(() => Money.assertInstanceOf(1000)).not.toThrow()
        expect(() => Money.assertInstanceOf(1000.1)).toThrow()
        expect(() => Money.assertInstanceOf('1000')).toThrow()
        expect(() => Money.assertInstanceOf({})).toThrow()
    })
})
