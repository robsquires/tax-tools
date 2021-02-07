require('dotenv').config()
const open = require('open')
const http = require('http')
const url = require('url')
const { Spinner } = require('cli-spinner')
const Monzo = require('../src/lib/monzo')

const spinner = new Spinner('🌍 Please complete login via web browser %s')

const port = process.env.PORT || 3000
const redirect_uri = `http://localhost:${port}/auth`

/**
 * This handles the redirect from monzo's auth provider
 * and exchanges the auth code for an access token
 */
async function requestListener(req, res) {
    // send a response to the browser
    function done(msg) {
        console.log(msg)
        res.writeHead(200)
        res.end(msg)
        process.exit(1)
    }

    spinner.stop()
    console.log('\n🔐 Received authorization code from Monzo')

    const { code } = url.parse(req.url, true).query

    try {
        // don't need oauth state since just running on localhost
        const accessToken = await Monzo.auth.getToken({ code, redirect_uri })
        await Monzo.tokenStore.set(accessToken)
    } catch (error) {
        console.log(error)
        return done('❌ Error saving access token!')
    }
    done("✅ Access token saved, don't forget to allow access via the app too")
}

/**
 * Start a http server and open the Monzo login url
 */
http.createServer(requestListener).listen(port, async () => {
    // disable node key bindings such as Ctrl-C
    process.stdin.setRawMode(true)

    // wait for keyboard input
    // once received stop listening
    process.stdin.once('data', () => {
        // re-enable key bindings
        process.stdin.setRawMode(false)
        spinner.start()
        // open URL in browser
        open(Monzo.auth.authorizeURL({ response_type: 'code', redirect_uri }))
    })
    console.log('➡️  Press any key to login to Monzo...')
})
