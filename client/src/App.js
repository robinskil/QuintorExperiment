import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import WeatherFactory from "./contracts/WeatherFactory.json";
import WeatherBet from "./contracts/WeatherBet.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = WeatherFactory.networks[networkId];
      const instance = new web3.eth.Contract(
        WeatherFactory.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.createBet(10).send({ from: accounts[0] });
    const contractAddress = await contract.methods.bets(0).call();
    console.log(contractAddress);
    await contract.methods.joinBet(contractAddress).send({ from: accounts[0] , value: this.state.web3.utils.toWei( "1", 'ether')});
    //console.log(await contract.methods.storeEth(contractAddress).send({ from: accounts[0] , value: this.state.web3.utils.toWei( "10", 'ether')}));
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getParticipators(contractAddress).call();
    console.log(response);
    const storedEth = await contract.methods.getStoredEth(contractAddress).call();
    console.log("amount: " + storedEth);
    // Update state with the result.
    this.setState({ storageValue: response });
  };

  clicked = async () =>{
    const { accounts, web3 , contract } = this.state;
    const instance = new web3.eth.Contract(
      WeatherBet.abi,
      await contract.methods.bets(0).call()
    );
    await instance.methods.join(accounts[0]).send({ from: accounts[0] , value: this.state.web3.utils.toWei( "1", 'ether')});
    console.log(await instance.methods.getETHAmount().call());
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <button onClick={this.clicked}>Test sub contract</button>
      </div>
    );
  }
}

export default App;
