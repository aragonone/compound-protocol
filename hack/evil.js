const utils = require('./utils')(web3, artifacts)
const ComptrollerEvil = artifacts.require('ComptrollerEvil')

async function main() {
  const [ctoken] = utils.processArgs()

  console.log(`\nDeploying evil Comptroller...`)
  const evil = await ComptrollerEvil.new()
  console.log(`evil Comptroller: ${evil.address}`)

  console.log(`\nSetting evil Comptroller in ceth`)
  const token = await utils.getTokenContract(ctoken)
  const tx = await token._setComptroller(evil.address)
  console.log(`tx`, JSON.stringify(tx, null, 2))
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
