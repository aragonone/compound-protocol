const utils = require('./utils')(web3, artifacts)

async function main() {
  const [ctoken, newOwner] = utils.processArgs()

  const token = await utils.getTokenContract(ctoken)

  console.log(`\nSetting new admin...`)
  const tx1 = await token._setPendingAdmin(newOwner)
  console.log(`tx1 (_setPendingAdmin)`, JSON.stringify(tx1, null, 2))
  const tx2 = await token._acceptAdmin({ from: newOwner })
  console.log(`tx2 (_acceptAdmin)`, JSON.stringify(tx2, null, 2))

  console.log(`\nVerifying new admin...`)
  console.log(`admin set: ${await token.admin()}`)
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
