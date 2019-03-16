// import React, { Component } from "react";
// import BettingFactory from "../contracts/BettingFactory.json";
// import WeatherBet from "../contracts/WeatherBet.json";
// import RandomBet from "../contracts/RandomNumberBet.json"
// import getWeb3 from "../utils/getWeb3";
// import { createRandomNumberBet, getOwnedBets } from "../helpers/BettingFactory";
// import { getBetAmount, getParticipators, instantiateWeatherContract, joinBet } from "../helpers/BetContract";
// import { MenuBar } from './Components/MenuBar';


// class CreateBetPage extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { web3: null, accounts: null, factoryContract: null, etherAmount: 0, bets: null };
//         this.onChangeEtherAmount = this.onChangeEtherAmount.bind(this);
//     }

//     componentDidMount = async () => {
//         try {
//             console.log("trying");
//             // Get network provider and web3 instance.
//             const web3 = await getWeb3();

//             // Use web3 to get the user's accounts.
//             const accounts = await web3.eth.getAccounts();
//             console.log("Logging accounts in!");
//             // Get the contract instance.
//             const networkId = await web3.eth.net.getId();
//             const deployedNetwork = BettingFactory.networks[networkId];
//             //creates an instance for the factoryContract
//             const instance = new web3.eth.Contract(
//                 BettingFactory.abi,
//                 deployedNetwork && deployedNetwork.address,
//             );
//             // Set web3, accounts, and contract to the state, and then proceed with an
//             // example of interacting with the contract's methods.
//             this.setState({ web3, accounts, factoryContract: instance }, this.setOwnedBets);
//         } catch (error) {
//             // Catch any errors for any of the above operations.
//             alert(
//                 `Failed to load web3, accounts, or contract. Check console for details.`,
//             );
//             console.error(error);
//         }
//     }

//     setOwnedBets = async () => {
//         //this.setState({bets:null});
//         const allBets = await getOwnedBets(this.state.factoryContract, this.state.accounts[0]);
//         console.log(allBets);
//         this.setState({ bets: allBets });
//         console.log("Reload page")
//     }

//     createNewContract = async () => {
//         const address = await createRandomNumberBet(this.state.accounts[0], this.state.factoryContract, this.state.etherAmount);
//         await this.setOwnedBets();
//     }

//     onChangeEtherAmount(event) {
//         this.setState({ etherAmount: event.target.value });
//     }

//     render() {
//         return (
//             <div id="PageHolder">
//                 {this.state.accounts != null && this.state.accounts[0] != null? <h2 style={{ textAlign: "center" }}> Welcome {this.state.accounts[0]}</h2> : <h1>No account</h1>}
//                 <div className="form-group row justify-content-center">
//                     <div>
//                         <button onClick={this.createNewContract} className="btn btn-primary">Create Contract</button>
//                     </div>
//                     <div className="col-6">
//                         <input className="form-control" type="number" value={this.state.etherAmount} onChange={this.onChangeEtherAmount} />
//                     </div>
//                 </div>
//                 <h3 style={{ textAlign: "center" }}>Contracts Created By You:</h3>
//                 <BetList bets={this.state.bets} web3={this.state.web3} />
//             </div>
//         )
//     }
// }

// class BetList extends Component {
//     render() {
//         return (
//             <div className="row justify-content-center">
//                 {this.props.bets != null ? this.props.bets.map(bet => {
//                     return (<BetInfo bet={bet} web3={this.props.web3} />)
//                 }) : null}
//             </div>
//         )
//     }
// }

// class BetInfo extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             betAmount: null,
//             participators: null,
//             contract: null
//         }
//         this.loadData = this.loadData.bind(this);
//         this.loadData();
//     }

//     async loadData() {
//         const instance = await instantiateWeatherContract(this.props.web3, WeatherBet, this.props.bet);
//         const betAmount = await getBetAmount(instance);
//         const participators = await getParticipators(instance);
//         this.setState({ contract: instance, betAmount: betAmount, participators: participators });
//     }


//     joinBet = async () => {
//         await joinBet(this.state.contract, this.props.account, this.state.betAmount, this.props.web3);
//         await this.loadData();
//     }

//     render() {
//         return (
//             <div className="col-8" style={{ marginTop: "15px" }}>
//                 <div className="card bg-light mb-3">
//                     <div className="card-body">
//                         <nav>
//                             <div className="nav nav-tabs" id="nav-tab" role="tablist" style={{ marginBottom: "15px" }}>
//                                 <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href={"#nav-main" + this.props.bet} role="tab" aria-controls="nav-home" aria-selected="true">Weather Bet</a>
//                                 <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href={"#nav-participants" + this.props.bet} role="tab" aria-controls="nav-profile" aria-selected="false">Participants</a>
//                                 <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href={"#nav-actions" + this.props.bet} role="tab" aria-controls="nav-contact" aria-selected="false">Actions</a>
//                             </div>
//                         </nav>

//                         <div className="tab-content" id="nav-tabContent">
//                             <div className="tab-pane fade show active" id={"nav-main" + this.props.bet} role="tabpanel" aria-labelledby="nav-home-tab">
//                                 <h6 className="card-subtitle mb-2 text-muted" style={{ marginTop: "0px" }}>Contract Address: {this.props.bet}</h6>
//                                 {this.state.betAmount != null ?
//                                     <p className="card-text">Amount to join bet: {this.state.betAmount} <img style={{ position: "relative", bottom: "2px", height: "15px", width: "15px" }} src="https://cdn4.iconfinder.com/data/icons/cryptocoins/227/ETH-512.png" /></p>
//                                  : null}
//                             </div>
//                             <div className="tab-pane fade" id={"nav-participants" + this.props.bet} role="tabpanel" aria-labelledby="nav-profile-tab">
//                                 {this.state.participators != null && this.state.participators.length > 0 ? this.state.participators.map(participant => {
//                                     return (
//                                         <p>{participant}</p>
//                                     )
//                                 }) : <p className="card-text">No participants</p>}
//                             </div>
//                             <div className="tab-pane fade" id={"nav-actions" + this.props.bet} role="tabpanel" aria-labelledby="nav-contact-tab">
//                                 <button className="btn btn-primary" onClick={this.joinBet}>Join bet</button>
//                             </div>
//                         </div>
//                         <div style={{ marginTop: "15px" }}>
//                             <a href="#" className="card-link">Link to the bet</a>
//                             <a href="#" className="card-link">Another link</a>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

// export default CreateBetPage