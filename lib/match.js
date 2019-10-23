const flattenObject = require('./flatten-object');

module.exports = function matchTransaction (tx, criteria) {
    const flattenedTx = flattenObject(tx);
    return !Object.keys(criteria).some(key => {
        const value = criteria[key];
        if (value.test) {
            return !value.test(flattenedTx[key]);
        } else {
            return value !== flattenedTx[key];
        }
    });
}
