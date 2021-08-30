const { processPayment, transactionMatcher, client } = require('../lib/monzo')
const feedItem = require('../../feed-item.template')
const { POT_ID, ACC_ID } = process.env

module.exports.handler = async (event) => {
    const { data } = JSON.parse(event.body)
    const matches = await transactionMatcher.match(data)
    if (!matches) {
        console.log('Transaction does not match, ignoring')
        return {
            statusCode: 200,
        }
    }

    console.log('Processing', data.id)
    try {
        const tax = await processPayment(data.id, POT_ID, ACC_ID)
        await client.writeToFeed(feedItem(tax), ACC_ID)
    } catch (err) {
        console.log('Error processing payment', err)
        await client.writeToFeed(
            {
                title: 'No taxy, no likey',
                image_url: 'https://cdn.dribbble.com/users/587537/screenshots/6320901/loading-ghost.gif',
            },
            ACC_ID,
        )
        return {
            // monzo will retry this up to 5 times
            statusCode: 500,
        }
    }

    return {
        statusCode: 200,
    }
}
