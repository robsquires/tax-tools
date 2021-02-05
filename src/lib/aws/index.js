const AWS = require('aws-sdk')
const S3Bucket = require('./s3-bucket')

const { DATA_BUCKET } = process.env

const dataBucket = new S3Bucket(new AWS.S3(), DATA_BUCKET)

module.exports = {
    dataBucket
}