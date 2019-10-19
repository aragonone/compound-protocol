const utils = require('./utils')(web3, artifacts)
const ERC20 = artifacts.require('DAI')

async function main() {

  // Parse args.
  const args = process.argv.slice(4, process.argv.length)
  const ctoken = args[0]
  const account = args[1]
  const amount = args[2]
  console.log(`\nBorrowing ${amount} ${ctoken} tokens from account ${account}...`)

  // Identify account.
  const accounts = await utils.getAccounts()
  const address = accounts[account]
  if (!address) {
    console.log(`ERROR: Unrecognized account '${account}'`)
    process.exit()
  }
  console.log(`\nUser:`)
  console.log(`  ${account}`)
  console.log(`  address: ${address}`)
  console.log(`  wallet: ${await utils.getBalanceInEther(address)} ETH`)

  // Identify cToken.
  const contracts = await utils.getContracts()
  const token = contracts[ctoken]
  if (!token) {
    console.log(`ERROR: Unrecognized ctoken '${ctoken}'`)
    process.exit()
  }
  console.log(`\nCToken:`)
  console.log(`  name: ${ctoken}`)
  console.log(`  address: ${token.address}`)

  // Validate amount.
  if (isNaN(amount)) {
    console.log(`ERROR: Invalid amount '${amount}'`)
    process.exit()
  }
  console.log(`\nAmount to borrow:`)
  console.log(`  ${amount} Tokens`)
  const amountToBorrow = utils.etherToWei(amount)
  console.log(`  ${amountToBorrow} 'Wei'`)

  // Redeem tokens.
  console.log(`\nBorrowing...`)
  const tx = await token.borrow(amountToBorrow, { from: address })
  console.log(`tx`, JSON.stringify(tx, null, 2))

  // Verify balances.
  console.log(`\nVerifying balances:`)
  const underlying = await token.underlying()
  const asset = await ERC20.at(underlying)
  console.log(`  borrowed balance: ${await asset.balanceOf(address)} 'Wei'`)
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
