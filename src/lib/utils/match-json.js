const pointer = require('json-pointer')
const debug = require('debug')('match-json')

function matchJSON(data, rules) {
    return (
        Object.entries(rules)
            .map(([query, matcher]) => {
                const [type, ...matchArgs] = matcher
                // field doesn't exist in data
                if (!pointer.has(data, query)) {
                    return [false, { query, matchArgs, value: null }]
                }

                const value = pointer.get(data, query)

                switch (type) {
                    case 'eq':
                        return [value === matchArgs[0], { query, matcher, value }]

                    case 'gt':
                        return [value > matchArgs[0], { query, matcher, value }]

                    case 'regex':
                        return [new RegExp(...matchArgs).test(value), { query, matcher, value }]

                    default:
                        throw Error(`Unknown match type ${type}`)
                }
            })
            // debug any failures
            .map(([result, criteria]) => {
                if (!result) {
                    debug('no match', criteria)
                }
                return result
            })
            // only return true is all rules match
            .every((result) => result)
    )
}

module.exports = matchJSON
