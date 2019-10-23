const match = require('./match');

const client = {
    moveToPot: (params) => console.log('moving to pot', params)
}

function getParams(tx, { potId, percentage }) {
    return {
        potId,
        amount: tx.data.amount * percentage
    }
}


module.exports = function processTransaction(tx, matchers = []) {
    
    const actions = matchers
        .filter(({ criteria }) => match(tx, criteria))
        .map(({ action }) => getParams(tx, action));
    

    actions.forEach(params => client.moveToPot(params))
}