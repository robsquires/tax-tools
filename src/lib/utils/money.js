function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && typeof n === 'number'
}

function validate(amount) {
    if (!isNumeric(amount)) {
        throw new Error(`Amount is not numeric: ${amount}`)
    }

    if (amount < 0) {
        throw new Error(`Amount cannot be negative: ${amount}`)
    }

    return amount
}

function fromPence(valueInPence) {
    if (!Number.isInteger(Number(valueInPence))) {
        throw new Error(`Money.fromPence expected integer, received ${valueInPence}`)
    }
    return validate(Number(valueInPence))
}

function fromPounds(valueInPounds) {
    const valueInPence = Math.round((valueInPounds * 100).toFixed(2))
    return fromPence(valueInPence)
}

function assertInstanceOf(value) {
    if (!Number.isInteger(value)) {
        throw new TypeError('Expected an Integer')
    }
}

function toPounds(value) {
    return parseFloat(value / 100)
}

module.exports = {
    fromPence,
    fromPounds,
    assertInstanceOf,
    toPounds,
}
