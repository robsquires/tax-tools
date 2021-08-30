require('dotenv').config()
const { client } = require('../src/lib/monzo')
const { ACC_ID } = process.env

async function main(url) {
    const { webhooks } = await client.listWebhooks(ACC_ID)

    console.log(`Found ${webhooks.length} webhooks`)

    const toDelete = webhooks.filter((webhook) => webhook.url === url)
    console.log(`Found ${toDelete.length} to delete`)

    await Promise.all(toDelete.map(({ id }) => client.deleteWebhook(id)))

    await client.registerWebhook(url, ACC_ID)

    return await client.listWebhooks(ACC_ID)
}

main(process.argv[2]).then(console.log).catch(console.err)
