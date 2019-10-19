const utils = require('./utils')(web3, artifacts)

async function main() {
  const [ctoken, account, amount] = utils.processArgs()
  const address = await utils.getAddressForAccount(account)
  const token = await utils.getTokenContract(ctoken)
  const amountToSupply = utils.getAmountInSmallestDenomination(amount)

  // Approve and mint.
  console.log(`\nApproving and minting...`)
  let tx
  if (ctoken === 'ceth') {
    console.log(`minting ceth`)
    tx = await token.mint({ value: amountToSupply, from: address })
  } else {
    await token.approve(token.address, amountToSupply, { from: address })
    tx = await token.mint(amountToSupply, { from: address })
  }
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
