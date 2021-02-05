const { tax } = require('../services/tax')

module.exports.handler = async (event) => {
  const { queryStringParameters } = event
  const netAmount = parseFloat(queryStringParameters.amount)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        grossAmount: await tax.calculateGrossPayment(netAmount),
        netAmount,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
