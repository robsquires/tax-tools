const { tax } = require('../services/tax')

module.exports.handler = async (event) => {
  const { queryStringParameters } = event
  const netAmount = parseFloat(queryStringParameters.amount)
  return {
    statusCode: 200,
    body: await tax.calculateGrossPayment(netAmount),
  }
}
