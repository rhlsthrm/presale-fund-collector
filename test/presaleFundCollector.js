/* global contract, artifacts, it, assert, web3 */

const PresaleFundCollector = artifacts.require('./PresaleFundCollector.sol')
const expectThrow = require('./expectThrow')

contract('PresaleFundCollector', accounts => {
  const ownerAccount = accounts[0]
  const nonWhitelistedAcccount = accounts[1]
  const whitelistedAccount = accounts[2]
  const emptyToAccount = accounts[3]

  it('should be owned by me', async () => {
    const instance = await PresaleFundCollector.deployed()
    const owner = await instance.owner.call()
    assert.equal(
      owner.toString(),
      ownerAccount,
      `Owner was ${owner.toString()} instead of ${ownerAccount}`
    )
  })

  it('should update whitelist properly', async () => {
    const instance = await PresaleFundCollector.deployed()
    let isWhitelisted = await instance.whitelist(whitelistedAccount)
    await instance.updateWhitelist(whitelistedAccount, true, {
      from: ownerAccount
    })
    isWhitelisted = await instance.whitelist(whitelistedAccount)
    assert.equal(isWhitelisted, true)
  })

  it('should not allow transfers without whitelist', async () => {
    const instance = await PresaleFundCollector.deployed()
    await expectThrow(
      instance.invest({ from: nonWhitelistedAcccount, value: 100 })
    )
    let balance = web3.eth.getBalance(instance.address)
    assert.equal(balance.toNumber(), 0)
    await instance.invest({ from: whitelistedAccount, value: 100 })
    balance = web3.eth.getBalance(instance.address)
    assert.equal(balance.toNumber(), 100)
  })

  it('should empty into wallet', async () => {
    const instance = await PresaleFundCollector.deployed()
    let balance = web3.eth.getBalance(instance.address)
    assert.isAbove(balance, 0)

    let emptyToAccountBalance = web3.eth.getBalance(emptyToAccount)

    await instance.emptyToWallet(emptyToAccount, { from: accounts[0] })
    balance = web3.eth.getBalance(instance.address)
    assert.equal(balance.toNumber(), 0)

    let newEmptyToAccountBalance = web3.eth.getBalance(emptyToAccount)
    assert.equal(
      newEmptyToAccountBalance.toNumber(),
      emptyToAccountBalance.toNumber() + 100
    )
  })
})
