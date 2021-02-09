const debug = require("debug")("process-payment");

function ProcessPayment(tax, transactions, monzo) {
  return async function processPayment(transactionId, potId, accountId) {
    debug("transaction-id", transactionId);
    const transaction = await transactions.find(transactionId);

    if (transaction) {
      // console.log('Already processed', transaction)
      // return
    }

    const { amount: amountInPence } = await monzo.getTransaction(transactionId);
    debug("amount-in-pence", amountInPence);

    const amount = parseFloat(amountInPence / 100);

    const taxToPay = await tax.getTax(amount);

    debug("tax", taxToPay);

    await monzo.depositToPot(taxToPay * 100, potId, accountId);

    await tax.applyTax(amount);

    await transactions.add(transactionId, { tax: taxToPay });

    await monzo.writeToFeed(
      {
        title: "Hello",
        body: "hello again",
        image_url:
          "https://static.ariste.info/wp-content/uploads/2020/04/1200px-Antu_dialog-warning.svg_-1.png",
      },
      accountId
    );
  };
}

module.exports = ProcessPayment;
