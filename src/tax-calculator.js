
class TaxCalculator {
    constructor (bands) {
        this.bands = bands
    }

    totalTax (amount) {
        const appliedBands = this.bands
            // remove tax bands that are above the amount to tax
            .filter(([ lower ]) => amount >= lower)
            // calculate taxable amount applicable to each band
            .map(([ lower, upper, rate ]) => {
                return [
                    amount > upper ? upper - lower : amount - lower,
                    rate
                ]
            })
        const totalTax = appliedBands.reduce(
            (acc, [taxableAmount, rate]) => (acc + taxableAmount * rate),
            0
        )
        return parseFloat(totalTax.toFixed(2))
    }
}

module.exports = TaxCalculator