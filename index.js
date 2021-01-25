require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000;

const { generateRedirectUrl, exchangeCode, listTransactions } = require('./lib/client')

app.use(bodyParser.json())

const getRedirectUri = req => `http://${req.headers.host}/auth`

app.get('/', (req, res) => {
    const uri = generateRedirectUrl(getRedirectUri(req))
    res.header('content-type', 'text/html')
    res.send(`<a href="${uri}">Login</a>`)
})

app.get('/auth', (req, res, next) => {
    const { code } = req.query
    exchangeCode(code, getRedirectUri(req))
        .then(() => {
            res.send('ok')
        })
        .catch(next)

})

app.get('/transactions', async (req, res, next) => {
    try {
        const transactions = await listTransactions()
        res.json(transactions)
    } catch (err) {
        next(err)
    }

})

app.listen(port, () => console.log(`Listening on port ${port}`))