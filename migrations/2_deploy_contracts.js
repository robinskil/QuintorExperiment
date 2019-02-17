var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var WeatherFactory = artifacts.require("WeatherFactory");

module.exports = function(deployer) {
  //deployer.deploy(SimpleStorage);
  deployer.deploy(WeatherFactory);
};
