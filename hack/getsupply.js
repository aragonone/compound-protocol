const utils = require('./utils')(web3, artifacts)

async function main() {
  const [ctoken, account] = utils.processArgs()
  const address = await utils.getAddressForAccount(account)
  const token = await utils.getTokenContract(ctoken)

  const suppliedBalance = await utils.getSuppliedBalance(token, address)
  console.log(`\nSupplied balance`)
  console.log(`  ${suppliedBalance} Tokens`)
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
