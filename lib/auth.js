const uuid = require('uuid/v1')

var state

var { REFRESH_TOKEN: token } = process.env
const getToken = () => token
const setToken = (newToken) => {
    console.log('Setting Token', newToken)
    token = newToken
}

function getState () {
    if (!state) {
        state = uuid()
    }
    return state;
}

module.exports = {
    getState,
    getToken,
    setToken
}
