const { tax } = require('../lib/tax')
const Money = require('../lib/utils/money')
const Joi = require('joi')

const schema = Joi.object({
    amount: Joi.number().required(),
})

module.exports.handler = async (event) => {
    const { queryStringParameters } = event
    const { error } = schema.validate(queryStringParameters || {})
    if (error) {
        return { statusCode: 400, body: error.message }
    }

    const netAmount = Money.fromPounds(queryStringParameters.amount)
    return {
        statusCode: 200,
        body: Money.toPounds(await tax.calculateGrossPayment(netAmount)),
    }
}
