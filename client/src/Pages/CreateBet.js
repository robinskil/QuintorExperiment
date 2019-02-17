import React, { Component } from "react";
import WeatherFactory from "./contracts/WeatherFactory.json";
import WeatherBet from "./contracts/WeatherBet.json";
import getWeb3 from "./utils/getWeb3";

class CreateBetPage extends Component {
    state = { web3: null, accounts: null, factoryContract: null }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = WeatherFactory.networks[networkId];
            //creates an instance for the factoryContract
            const instance = new web3.eth.Contract(
                WeatherFactory.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, factoryContract: instance }, this.runExample);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

}