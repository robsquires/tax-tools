const fetch = require('node-fetch');
const uuid = require('uuid/v1');
const { getToken, setToken, getState } = require('./auth');

const HOST = 'https://api.monzo.com';

const {
    CLIENT_SECRET: client_secret,
    CLIENT_ID: client_id,
    REFRESH_TOKEN: refresh_token,
    ACC_ID: account_id,
} = process.env;

function serializeForm(obj) {
    return Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&')
}

async function listTransactions () {
    const accessToken = await getAccessToken()

    const response = await fetch(`${HOST}/transactions?${serializeForm({ account_id, limit: 10 })}`, {
        headers: {
            authorization: `Bearer ${accessToken}`,
        }
    })
    const data = await response.json()
    if (!response.ok) {
        console.log(data)
        throw new Error('cannot list transactions')
    }

    return data

}

function moveToPot({ potId, amount, accountId }) {
    return fetch(`${HOST}/pots/${potId}/deposit`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            authorization: `Bearer ${getUser().access_token}`,
        },
        body: serializeForm({
            amount,
            source_account_id: accountId,
            dedupe_id: uuid()
        })
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

async function getAccessToken () {

    const response = await fetch(`${HOST}/oauth2/token`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: serializeForm({
            grant_type: 'refresh_token',
            client_id,
            client_secret,
            refresh_token: getToken(),
        })
    })
    const data = await response.json()
    if (!response.ok) {
        console.log(data)
        throw new Error('Token nok')
    }
    setToken(data.refresh_token)
    return data.access_token
}

function generateRedirectUrl (redirect_uri) {
    return `https://auth.monzo.com/?${serializeForm({
        response_type: 'code',
        state: getState(),
        client_id,
        redirect_uri
    })}`
}


function exchangeCode (code, redirect_uri) {
    const body = serializeForm({
        grant_type: 'authorization_code',
        client_id,
        client_secret,
        redirect_uri,
        code
    })
    return fetch(`${HOST}/oauth2/token`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body
    }).then(res => 
        res.json().then(body => {
            if (res.ok) {
                console.log('exchanged token', body)
                setToken(body.refresh_token)
                return body;
            }
            console.log(res.status);
            console.log(body);
            throw new Error('ouch'); 
        })
    )
}

module.exports = {
    moveToPot,
    generateRedirectUrl,
    exchangeCode,
    listTransactions
}