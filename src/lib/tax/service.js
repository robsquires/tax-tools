const money = require('../utils/money')
class TaxService {
    constructor(calculator, earnings) {
        this.calculator = calculator
        this.earnings = earnings
    }

    async calculateTax(amount) {
        amount = money.parse(amount)

        const earningsToDate = await this.earnings.get()
        return this.calculator.calculateNet(earningsToDate, amount)
    }

    async applyTax(amount) {
        amount = money.parse(amount)

        const earningsToDate = await this.earnings.get()
        const taxToApply = this.calculator.calculateNet(earningsToDate, amount)
        await this.earnings.set(earningsToDate + amount)
        return taxToApply
    }

    async calculateGrossPayment(netAmount) {
        netAmount = money.parse(netAmount)

        const earningsToDate = await this.earnings.get()
        return this.calculator.grossUp(earningsToDate, netAmount)
    }
}

module.exports = TaxService
