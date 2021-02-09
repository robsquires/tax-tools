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

module.exports = {
    parse,
}
