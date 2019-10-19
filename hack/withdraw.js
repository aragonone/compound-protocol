const utils = require('./utils')(web3, artifacts)

async function main() {
  const [ctoken, account, amount] = utils.processArgs()
  const address = await utils.getAddressForAccount(account)
  const token = await utils.getTokenContract(ctoken)
  const amountToWithdraw = utils.getAmountInSmallestDenomination(amount)

  // Redeem tokens.
  console.log(`\nRedeeming...`)
  const tx = await token.redeemUnderlying(amountToWithdraw, { from: address })
  console.log(`tx`, JSON.stringify(tx, null, 2))

  // Verify balances.
  console.log(`\nVerifying balances:`)
  console.log(`  wallet: ${await utils.getBalanceInEther(address)} ETH`)
  console.log(`  supplied balance: ${await utils.getSuppliedBalance(token, address)} ETH`)
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
