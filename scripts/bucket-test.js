require('dotenv').config()

const AWS = require('aws-sdk')
const S3Bucket = require('../src/s3-bucket')

const taxBucket = new S3Bucket(new AWS.S3(), 'monzo-tax-collector')

async function main() {
    await taxBucket.write('test', { date: new Date() })
    const data = await taxBucket.read('test')
    console.log('data', data)
}

main().catch(err => console.error(err))