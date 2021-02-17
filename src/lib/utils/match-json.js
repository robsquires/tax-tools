const pointer = require('json-pointer')

function matchJSON(data, rules) {
    return Object.entries(rules).every(([query, [type, ...matcher]]) => {
        if (!pointer.has(data, query)) {
            return false
        }
        const value = pointer.get(data, query)

        switch (type) {
            case 'eq':
                return value === matcher[0]

            case 'regex':
                return new RegExp(...matcher).test(value)

            default:
                throw Error(`Unknown match type ${type}`)
        }
    })
}

module.exports = matchJSON
