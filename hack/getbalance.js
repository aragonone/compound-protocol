const utils = require('./utils')(web3, artifacts)

async function main() {
  const [account] = utils.processArgs()
  const address = await utils.getAddressForAccount(account)
}

// Required by `truffle exec`.
module.exports = function(callback) {
  main()
    .then(() => callback())
    .catch(err => {
      console.log(`Error:`, err)
      callback(err)
    })
}
