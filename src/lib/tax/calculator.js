const debug = require('debug')('tax-calculator')

class TaxCalculator {
    constructor(bands) {
        this.bands = bands
    }

    calcNetPerBand(grossBalance, grossAmount, bandIdx = 0) {
        debug('calcNetPerBand', bandIdx, { grossBalance, grossAmount })
        if (!this.bands[bandIdx]) {
            return
        }

        const [upper, rate] = this.bands[bandIdx]
        const remaining = upper - grossBalance

        let grossAllocated
        if (grossBalance > upper) {
            grossAllocated = 0
        } else {
            grossAllocated = grossAmount < remaining ? grossAmount : remaining
        }

        const netAmount = parseInt(grossAllocated * rate)
        const amountFromNextBand = this.calcNetPerBand(
            grossBalance + grossAllocated,
            grossAmount - grossAllocated,
            bandIdx + 1,
        )
        return amountFromNextBand ? [netAmount].concat(amountFromNextBand) : [netAmount]
    }

    calcGrossPerBand(grossBalance, netAmount, bandIdx) {
        debug('calcGrossPerBand', bandIdx, { grossBalance, netAmount })
        if (!this.bands[bandIdx]) {
            return
        }

        const [upper, rate] = this.bands[bandIdx]
        const grossAmount = parseInt(netAmount / (1 - rate))
        const grossRemaining = upper - grossBalance

        let grossAllocated
        if (grossBalance > upper) {
            grossAllocated = 0
        } else {
            grossAllocated = grossAmount > grossRemaining ? grossRemaining : grossAmount
        }

        const netAllocated = parseInt(grossAllocated * (1 - rate))

        const amountFromNextBand = this.calcGrossPerBand(
            grossBalance + grossAllocated,
            netAmount - netAllocated,
            bandIdx + 1,
        )
        return amountFromNextBand ? [grossAllocated].concat(amountFromNextBand) : [grossAllocated]
    }

    calculateNet(grossBalance, grossAmount) {
        const netPerBand = this.calcNetPerBand(grossBalance, grossAmount, 0)
        const totalTax = netPerBand.reduce((acc, netAmount) => acc + netAmount, 0)
        debug('calculateNet', { netPerBand, totalTax })

        return totalTax
    }

    grossUp(grossBalance, netAmount) {
        const grossPerBand = this.calcGrossPerBand(grossBalance, netAmount, 0)
        const totalGross = grossPerBand.reduce((acc, grossAmount) => acc + grossAmount, 0)
        debug('grossUp', { grossPerBand, totalGross })

        return totalGross
    }
}

module.exports = TaxCalculator
