const flattenObject = require('./flatten-object');

module.exports = function filterTransaction ({ type, data }, criteria) {
    
    if (type !== 'transaction.created') {
        return null;
    }

    const flattenedTx = flattenObject(data);
    const matchesCriteria = !Object.keys(criteria).some(key => {
        const value = criteria[key];
        if (value.test) {
            return !value.test(flattenedTx[key]);
        } else {
            return value !== flattenedTx[key];
        }
    });

    return matchesCriteria ? data : null
}
