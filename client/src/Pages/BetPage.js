import React, { Component } from "react";
import WeatherFactory from "../contracts/WeatherFactory.json";
import WeatherBet from "../contracts/WeatherBet.json";
import { createContract, getOwnedBets } from "../helpers/Contracts";
import { getBetAmount, getParticipators, instantiateWeatherContract, joinBet } from "../helpers/BetContract";

class BetPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: null,
            factoryContract: null,
            loading: true,
        }
        this.loadingAccountDetails = this.loadingAccountDetails.bind(this);
        this.createContract = this.createContract.bind(this);
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

    render() {
        if (this.state.loading) return (
            <div className="row justify-content-center">
                <div className="col-12">
                    <h3 style={{ textAlign: "center" }}>Make sure you are logged in onto metamask.</h3>
                </div>
                <div>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        )
        if (this.state.accounts == null || this.state.accounts[0] === undefined || this.state.factoryContract == null) {
            return (
                <div>
                    <p>Could not load any accounts , make sure you logged in onto metamask and have an account selected.</p>
                </div>
            )
        }
        return (
            <div>
                <h3 style={{ textAlign: "center" }}>
                    Welcome {this.state.accounts[0]}
                </h3>
                <CreateContractForm web3={this.props.web3} account={this.props.accounts[0]} factoryContract={this.state.factoryContract} />
            </div>
        )
    }
}

class CreateContractForm extends Component{
    constructor(props){ 
        super(props);
        this.state={
            etherAmount : null,
            amountOfParticipators : null,
            friendsOnly : false,
            openOnInit : true,
            closeOnTime : undefined
        }
    }

    render(){
        return(
            <div>

            </div>
        )
    }
}


export default BetPage;