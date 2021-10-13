const Money = require('../utils/money')
class TaxService {
    constructor(calculator, earnings) {
        this.calculator = calculator
        this.earnings = earnings
    }

    async calculateTax(grossAmount) {
        Money.assertInstanceOf(grossAmount)
        const earningsToDate = await this.earnings.get()
        const tax = this.calculator.calculateNet(earningsToDate, grossAmount)
        return Money.fromPence(tax)
    }

    async currentTaxLiability() {
        const earningsToDate = await this.earnings.get()
        const tax = this.calculator.calculateNet(0, earningsToDate)
        return Money.fromPence(tax)
    }

    async applyTax(grossAmount) {
        Money.assertInstanceOf(grossAmount)
        const earningsToDate = await this.earnings.get()
        const tax = this.calculator.calculateNet(earningsToDate, grossAmount)
        await this.earnings.set(Money.fromPence(earningsToDate + grossAmount))
        return Money.fromPence(tax)
    }

    async calculateGrossPayment(netAmount) {
        Money.assertInstanceOf(netAmount)
        const earningsToDate = await this.earnings.get()
        const grossAmount = this.calculator.grossUp(earningsToDate, netAmount)
        return Money.fromPence(grossAmount)
    }
}

module.exports = TaxService
