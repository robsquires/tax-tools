const { tax } = require('../lib/tax')
const Money = require('../lib/utils/money')
module.exports.handler = async (event) => {
    const { queryStringParameters } = event
    const netAmount = Money.fromPounds(queryStringParameters.amount)
    return {
        statusCode: 200,
        body: Money.toPounds(await tax.calculateGrossPayment(netAmount)),
    }
}
