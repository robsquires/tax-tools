function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && typeof n === 'number'
}

function parse(amount) {
    if (!isNumeric(amount)) {
        throw new Error(`Amount is not numeric: ${amount}`)
    }

    if (amount < 0) {
        throw new Error(`Amount cannot be negative: ${amount}`)
    }

    return parseFloat(amount.toFixed(2))
}

class Money {
    constructor(value) {
        this.value = value
    }

    valueOf() {
        return parseInt(this.value)
    }

    static fromPence(valueInPence) {
        return new Money(valueInPence)
    }

    static fromPounds(valueInPounds) {
        const valueInPence = parseInt(valueInPounds * 100)
        return new Money(valueInPence)
    }
}

module.exports = {
    parse,
    Money,
}

// fromPence, fromPound
