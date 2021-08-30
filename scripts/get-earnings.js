require('dotenv').config()

const { earnings } = require('../src/lib/tax')

earnings.get().then(console.log).catch(console.err)
