const money = require('../utils/money')
class TaxService {
    constructor(calculator, earnings) {
        this.calculator = calculator
        this.earnings = earnings
    }

    async applyTax(amount) {
        var earningsToDate = 0
        try {
            earningsToDate = await this.earnings.get()
        } catch (err) {
            // could abstract to something domain specific
            // or move into earnings service
            if (err.statusCode !== 404) {
                throw err
            }
        }

        const taxToApply = this.calculator.calculateNet(earningsToDate, amount)

        await this.earnings.set(earningsToDate + amount)

        return taxToApply
    }

    async calculateGrossPayment(netAmount) {
        netAmount = money.parse(netAmount)
        var earningsToDate = 0
        try {
            earningsToDate = await this.earnings.get()
        } catch (err) {
            // could abstract to something domain specific
            // or move into earnings service
            if (err.statusCode !== 404) {
                throw err
            }
        }
        return this.calculator.grossUp(earningsToDate, netAmount)
    }
}

module.exports = TaxService
