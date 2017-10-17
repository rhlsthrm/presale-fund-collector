const PresaleFundCollector = artifacts.require('./PresaleFundCollector.sol')

module.exports = function (deployer) {
  deployer.deploy(PresaleFundCollector, 1)
}
