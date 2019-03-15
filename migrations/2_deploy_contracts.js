var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var WeatherFactory = artifacts.require("BettingFactory");

module.exports = function(deployer) {
  //deployer.deploy(SimpleStorage);
  deployer.deploy(WeatherFactory);
};
