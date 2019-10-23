const fetch = require('node-fetch');
const uuid = require('uuid/v1');

const { ACCESS_TOKEN } = process.env;

function moveToPot({ potId, amount, accountId }) {

    return fetch(`https://api.monzo.com/pots/${potId}/deposit`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: `amount=${amount}&dedupe_id=${uuid()}&source_account_id=${accountId}`
    })
    .then(res =>
        res.json().then(body => {
            if (res.ok) {
                return body;
            }
            console.log(body);
            throw new Error('ouch'); 
        })
    )
}

module.exports = {
    moveToPot
}