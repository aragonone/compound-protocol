module.exports = (web3, artifacts) => {
  const Utils = {
    processArgs: function() {
      return process.argv.slice(4, process.argv.length)
    },

    getAccounts: async function() {
      const accounts = await web3.eth.getAccounts();

      return {
        admin: accounts[0], //0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1
        user1: accounts[1], //0xffcf8fdee72ac11b5c542428b35eef5769c409f0
        user2: accounts[2], //0x22d491bde2303f2f43325b2108d26f1eaba1e32b
        user3: accounts[3], //0xe11ba2b4d45eaed5996cd0823791e0c93114882d
        user4: accounts[4], //0xd03ea8624c8c5987235048901fb614fdca89b117
        user5: accounts[5], //0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc
        user6: accounts[6], //0x3e5e9111ae8eb78fe1cc3bb8915d5d461f3ef9a9
        user7: accounts[7], //0x28a8746e75304c0780e011bed21c72cd78cd535e
        user8: accounts[8], //0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e
        user9: accounts[9]  //0x1df62f291b2e969fb0849d99d9ce41e2f137006e
      }
    },

    getAddressForAccount: async function(account) {
      const accounts = await Utils.getAccounts()
      const address = accounts[account]
      if (!address) {
        console.log(`ERROR: Unrecognized account '${account}'`)
        process.exit()
      }
      console.log(`\nAccount:`)
      console.log(`  ${account}`)
      console.log(`  address: ${address}`)
      console.log(`  wallet: ${await Utils.getBalanceInEther(address)} ETH`)

      return address
    },

    getContracts: async function() {
      return {
        ceth: await artifacts.require('cETH').deployed(),
        cdai: await artifacts.require('cDAI').deployed(),
      }
    },

    getTokenContract: async function(ctoken) {
      const contracts = await Utils.getContracts()
      const token = contracts[ctoken]
      if (!token) {
        console.log(`ERROR: Unrecognized ctoken '${ctoken}'`)
        process.exit()
      }
      console.log(`\nCToken:`)
      console.log(`  name: ${ctoken}`)
      console.log(`  address: ${token.address}`)

      return token
    },

    getAmountInSmallestDenomination: function(amount) {
      if (isNaN(amount)) {
        console.log(`ERROR: Invalid amount '${amount}'`)
        process.exit()
      }
      console.log(`\nAmount to supply:`)
      console.log(`  ${amount} tokens`)
      const expandedAmount = Utils.etherToWei(amount)
      console.log(`  ${expandedAmount} wei`)

      return expandedAmount
    },

    etherToWei: function(ether) {
      return web3.utils.toWei(`${ether}`, 'ether')
    },

    weiToEther: function(wei) {
      return web3.utils.fromWei(`${wei}`, 'ether')
    },

    scaledWeiToEther: function(wei) {
      return Utils.weiToEther(Utils.weiToEther(wei))
    },

    getBalanceInEther: async function(account) {
      return Utils.weiToEther(await web3.eth.getBalance(account))
    },

    getSuppliedBalance: async function(ctoken, user) {
      const cTokenExchangeRate = await ctoken.exchangeRateStored()
      const cTokenBalance = await ctoken.balanceOf(user)
      const ethBalance = cTokenBalance.mul(cTokenExchangeRate).toString()
      return Utils.scaledWeiToEther(ethBalance)
    },
  }

  return Utils
}
