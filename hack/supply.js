const utils = require('./utils')(web3, artifacts)

async function main() {

  // Parse args.
  const args = process.argv.slice(4, process.argv.length)
  const ctoken = args[0]
  const account = args[1]
  const amount = args[2]
  console.log(`\nSupplying ${amount} ${ctoken} tokens from account ${account}...`)

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
  console.log(`\nAmount to supply:`)
  console.log(`  ${amount} ETH`)
  const amountToSupply = utils.etherToWei(amount)
  console.log(`  ${amountToSupply} Wei`)

  // Approve and mint.
  console.log(`\nApproving and minting...`)
  await token.approve(token.address, amountToSupply, { from: address })
  await token.mint({ value: amountToSupply, from: address })

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
