import React, { Component } from "react";
import BettingFactory from "../contracts/BettingFactory.json";
import WeatherBet from "../contracts/WeatherBet.json";
import RandomNumberBet from "../contracts/RandomNumberBet.json";
import { createContract, getOwnedBets } from "../helpers/BettingFactory";
import { getRandomNumber , getBetAmount, getParticipators, instantiateWeatherContract, joinBet, createRandomNumber } from "../helpers/BetContract";

class ViewOwnBets extends Component{
    constructor(props){
        super(props);
        this.state= {
            accounts :null,
            factoryContract : null,
            loading:true
        }
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
            const deployedNetwork = BettingFactory.networks[networkId];
            const instance = new web3.eth.Contract(
                BettingFactory.abi,
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
        return(
            <AllBets web3={this.props.web3} account={this.state.accounts[0]} factoryContract={this.state.factoryContract} />
        )
    }
}

class AllBets extends Component{
    constructor(props){
        super(props)
        this.state={
            loading:true,
            allBets : null
        }
    }

    componentDidMount = async () =>{
        const bets = await getOwnedBets(this.props.factoryContract , this.props.account);
        this.setState({allBets : bets , loading:false});
        console.log("all bets amount:" + bets.length)
    }

    render(){
        if(this.state.loading){
            return(
                <div>
                    Loading XD
                </div>
            )
        }
        if(this.state.allBets == null || this.state.allBets.length < 1){
            return(<div>
                No bets
            </div>
            )
        }
        return(
            <div>
                {this.state.allBets.map(bet =>{
                    return(
                        <BetInfo account={this.props.account} web3={this.props.web3} bet={bet} />
                    )
                })}
            </div>
        )
    }
}

class BetInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            betAmount: null,
            randomNumber: undefined,
            participators: null,
            contract: null
        }
        this.loadData = this.loadData.bind(this);
        this.loadData();
    }

    async loadData() {
        const instance = await instantiateWeatherContract(this.props.web3, RandomNumberBet, this.props.bet);
        const betAmount = await getBetAmount(instance);
        const participators = await getParticipators(instance);
        const value = await getRandomNumber(instance);
        
        console.log(value);
        this.setState({ contract: instance, betAmount: betAmount, participators: participators , randomNumber:value});
    }


    joinBet = async () => {
        console.log(this.props.account);
        await joinBet(this.state.contract, this.props.account, this.state.betAmount, this.props.web3);
        await this.loadData();
    }

    render() {
        return (
            <div className="col-8" style={{ marginTop: "15px" }}>
                <div className="card bg-light mb-3">
                    <div className="card-body">
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist" style={{ marginBottom: "15px" }}>
                                <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href={"#nav-main" + this.props.bet} role="tab" aria-controls="nav-home" aria-selected="true">Weather Bet</a>
                                <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href={"#nav-participants" + this.props.bet} role="tab" aria-controls="nav-profile" aria-selected="false">Participants</a>
                                <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href={"#nav-actions" + this.props.bet} role="tab" aria-controls="nav-contact" aria-selected="false">Actions</a>
                            </div>
                        </nav>

                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id={"nav-main" + this.props.bet} role="tabpanel" aria-labelledby="nav-home-tab">
                                <h6 className="card-subtitle mb-2 text-muted" style={{ marginTop: "0px" }}>Contract Address: {this.props.bet}</h6>
                                {this.state.betAmount != null ?
                                    <div>
                                        <p className="card-text">Amount to join bet: {this.state.betAmount} <img style={{ position: "relative", bottom: "2px", height: "15px", width: "15px" }} src="https://cdn4.iconfinder.com/data/icons/cryptocoins/227/ETH-512.png" /></p>
                                        <p className="cart-text">Random number is: {this.state.randomNumber}</p>
                                    </div>
                                 : null}
                            </div>
                            <div className="tab-pane fade" id={"nav-participants" + this.props.bet} role="tabpanel" aria-labelledby="nav-profile-tab">
                                {this.state.participators != null && this.state.participators.length > 0 ? this.state.participators.map(participant => {
                                    return (
                                        <p>{participant}</p>
                                    )
                                }) : <p className="card-text">No participants</p>}
                            </div>
                            <div className="tab-pane fade" id={"nav-actions" + this.props.bet} role="tabpanel" aria-labelledby="nav-contact-tab">
                                <button className="btn btn-primary" onClick={this.joinBet}>Join bet</button>
                            </div>
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <a href="#" className="card-link">Link to the bet</a>
                            <a href="#" className="card-link">Another link</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ViewOwnBets