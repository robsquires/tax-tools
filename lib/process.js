const match = require('./match');
const client = require('./client');


function getParams(tx, { potId, percentage }) {
    return {
        potId,
        amount: tx.data.amount * percentage
    }
}


module.exports = function processTransaction(tx, matchers = [], accountId) {
    
    const actions = matchers
        .filter(({ criteria }) => match(tx, criteria))
        .map(({ action }) => getParams(tx, action));
    

    Promise.all(actions.map(params => client.moveToPot({...params, accountId })))
    .then((responses) => {
        console.log('ok', responses)
    })
    .catch(console.error)
}