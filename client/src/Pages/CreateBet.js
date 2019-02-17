import React, { Component } from "react";
import WeatherFactory from "../contracts/WeatherFactory.json";
import WeatherBet from "../contracts/WeatherBet.json";
import getWeb3 from "../utils/getWeb3";
import { createContract, getOwnedBets } from "../helpers/Contracts";
import { getBetAmount, getParticipators, instantiateWeatherContract , joinBet } from "../helpers/BetContract";


class CreateBetPage extends Component {
    constructor(props) {
        super(props);
        this.state = { web3: null, accounts: null, factoryContract: null, etherAmount: 0, bets: null };
        this.onChangeEtherAmount = this.onChangeEtherAmount.bind(this);
    }

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
            this.setState({ web3, accounts, factoryContract: instance }, this.setOwnedBets);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    setOwnedBets = async () => {
        const allBets = await getOwnedBets(this.state.factoryContract, this.state.accounts[0]);
        this.setState({ bets: allBets.reverse() });
    }

    createNewContract = async () => {
        const address = await createContract(this.state.accounts[0], this.state.factoryContract, this.state.etherAmount)
        console.log(address);
        console.log(await this.state.factoryContract.methods.bets(0).call());
        const currentContract = new this.state.web3.eth.Contract(
            WeatherBet.abi,
            await this.state.factoryContract.methods.bets(0).call()
        );
        console.log(await this.state.factoryContract.methods.bets(0).call());
        this.setOwnedBets();

    }

    onChangeEtherAmount(event) {
        this.setState({ etherAmount: event.target.value });
    }

    async getValues(bet) {
        return
    }

    render() {
        return (
            <div id="PageHolder" className="container">
                {this.state.accounts != null ? <h2 style={{ textAlign: "center" }}> Welcome {this.state.accounts[0]}</h2> : null}
                <div className="form-group row justify-content-center">
                    <div>
                        <button onClick={this.createNewContract} className="btn btn-primary">Create Contract</button>
                    </div>
                    <div className="col-6">
                        <input className="form-control" type="number" value={this.state.etherAmount} onChange={this.onChangeEtherAmount} />
                    </div>
                </div>
                <h3 style={{textAlign:"center"}}>Contracts Created By You:</h3>
                <div className="row justify-content-center">
                    {this.state.bets != null ? this.state.bets.map(bet => {
                        return (
                            <BetCard account={this.state.accounts[0]} web3={this.state.web3} bet={bet} />
                        )
                    }) : null}

                </div>
            </div>
        )
    }
}

class BetCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            betAmount: 'Loading',
            participators: 'None',
            contract : null
        }
        this.joinBet = this.joinBet.bind(this);
        this.fillData = this.fillData.bind(this);
    }

    componentDidMount = async () => {

        this.setState({contract: await instantiateWeatherContract(this.props.web3, WeatherBet, this.props.bet)});
        this.fillData();
    }

    fillData = async ()=>{
        this.setState({ betAmount: await getBetAmount(this.state.contract) , 
            participators: await getParticipators(this.state.contract),
          });
    }

    joinBet = async() =>{
        await joinBet(this.state.contract , this.props.account , this.state.betAmount , this.props.web3);
        this.fillData();
    }

    render() {
        return (
            <div className="col-8" style={{ marginTop: "15px" }}>
                <div className="card bg-light mb-3">
                    <div className="card-body">
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist" style={{marginBottom:"15px"}}>
                                <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href={"#nav-main" + this.props.bet} role="tab" aria-controls="nav-home" aria-selected="true">Weather Bet</a>
                                <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href={"#nav-participants" + this.props.bet} role="tab" aria-controls="nav-profile" aria-selected="false">Participants</a>
                                <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href={"#nav-actions" + this.props.bet} role="tab" aria-controls="nav-contact" aria-selected="false">Actions</a>
                            </div>
                        </nav>

                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id={"nav-main" + this.props.bet} role="tabpanel" aria-labelledby="nav-home-tab">
                                <h6 className="card-subtitle mb-2 text-muted" style={{marginTop:"0px"}}>Contract Address: {this.props.bet}</h6>
                                <p className="card-text">Amount to join bet: {this.state.betAmount} <img style={{ position: "relative", bottom: "2px", height: "15px", width: "15px" }} src="https://cdn4.iconfinder.com/data/icons/cryptocoins/227/ETH-512.png" /></p>
                            </div>
                            <div className="tab-pane fade" id={"nav-participants" + this.props.bet} role="tabpanel" aria-labelledby="nav-profile-tab">
                                {this.state.participators !== 'None' && this.state.participators.length > 0 ? this.state.participators.map( participant => {
                                    return(
                                        <p>{participant}</p>
                                    )
                                }) : <p className="card-text">No participants</p>}
                            </div>
                            <div className="tab-pane fade" id={"nav-actions" + this.props.bet} role="tabpanel" aria-labelledby="nav-contact-tab">
                                <button className="btn btn-primary" onClick={this.joinBet}>Join bet</button>
                            </div>
                        </div>
                        <div style={{marginTop:"15px"}}>
                            <a href="#" className="card-link">Link to the bet</a>
                            <a href="#" className="card-link">Another link</a>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default CreateBetPage