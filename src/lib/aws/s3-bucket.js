const debug = require('debug')('s3-bucket')
class S3Bucket {
    constructor(s3, bucket) {
        this.s3 = s3
        this.bucket = bucket
    }

    read(objectKey) {
        debug('read', this.bucket, objectKey)
        return new Promise((resolve, reject) => {
            this.s3.getObject({ Bucket: this.bucket, Key: objectKey }, (err, data) =>
                err ? reject(err) : resolve(JSON.parse(data.Body)),
            )
        })
    }

    write(objectKey, data) {
        debug('write', this.bucket, objectKey)
        return new Promise((resolve, reject) => {
            this.s3.putObject({ Bucket: this.bucket, Key: objectKey, Body: JSON.stringify(data) }, (err, data) =>
                err ? reject(err) : resolve(data),
            )
        })
    }
}

module.exports = S3Bucket
