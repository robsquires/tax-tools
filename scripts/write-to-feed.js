require('dotenv').config()
const { client } = require('../src/lib/monzo')
const { ACC_ID } = process.env

let feedItem = require('../feed-item.template')

client.writeToFeed(feedItem(), ACC_ID).then(console.log).catch(console.error)
