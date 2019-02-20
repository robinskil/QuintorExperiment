import React, { Component } from "react";
import WeatherFactory from "../contracts/WeatherFactory.json";
import WeatherBet from "../contracts/WeatherBet.json";
import { createContract, getOwnedBets } from "../helpers/Contracts";
import { getBetAmount, getParticipators, instantiateWeatherContract, joinBet } from "../helpers/BetContract";

class ViewOwnBets extends Component{
    constructor(props){
        super(props);
        this.loadingAccountDetails = this.loadingAccountDetails.bind(this);
    }

    componentDidMount = async () => {
        this.loadingAccountDetails();
    }

    loadingAccountDetails = async () => {
        try {
            const web3 = this.props.web3;
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = WeatherFactory.networks[networkId];
            const instance = new web3.eth.Contract(
                WeatherFactory.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.setState({ accounts, factoryContract: instance });
        }
        catch (error) {
            alert(error);
        }
        finally {
            this.setState({ loading: false });
        }
    }
    
    render(){
        return(
            <h1>View bets page!</h1>
        )
    }

}

export default ViewOwnBets