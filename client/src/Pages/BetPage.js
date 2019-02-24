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
                <h4 style={{ textAlign: "center" }}>
                    Welcome {this.state.accounts[0]}
                </h4>
                {this.state.factoryContract != null ?
                    <CreateContractForm web3={this.props.web3} account={this.state.accounts[0]} factoryContract={this.state.factoryContract} />
                    : null}

            </div>
        )
    }
}

class CreateContractForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            etherAmount: null,
            amountOfParticipators: null,
            friendsOnly: "false",
            openOnInit: "true",
            closeOnTime: undefined,
        }
        this.buildContract = this.buildContract.bind(this);
        this.onChangeEther = this.onChangeEther.bind(this);
        this.onChangeFriendsOnly = this.onChangeFriendsOnly.bind(this);
        this.onChangeOpenOnInit = this.onChangeOpenOnInit.bind(this);
        this.onChangeParticipators = this.onChangeParticipators.bind(this);
    }

    onChangeEther(event){
        this.setState({etherAmount : event.target.value});
    }
    onChangeParticipators(event){
        this.setState({amountOfParticipators : event.target.value});
    }
    onChangeFriendsOnly(event){
        this.setState({friendsOnly : event.target.value});
    }
    onChangeOpenOnInit(event){
        this.setState({openOnInit : event.target.value});
    }
    render() {
        return (
            <div className="justify-content-center">
                <form class="was-validated" onSubmit={this.buildContract}>
                    <div class="form-group">
                        <label for="validationServer01">Amount of Ether</label>
                        <input type="number" class="form-control" id="validationServer01" min={0} value={this.state.etherAmount} onChange={this.onChangeEther} required />
                        <div class="invalid-feedback">
                            Please fill in a amount of ether you want to bet.
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="validationServer01">Max participators</label>
                        <input type="number" class="form-control" id="validationServer01" min={0} max={64} value={this.state.amountOfParticipators} onChange={this.onChangeParticipators} required />
                        <div class="invalid-feedback">
                            Please fill the max amount of participators (Maximum = 64).
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="custom-select-label" for="customSelect">Open contract at creation?</label>
                        <select class="custom-select" onChange={this.onChangeOpenOnInit} value={this.state.openOnInit} required>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        <div class="invalid-feedback">Open contract at creation.</div>
                    </div>
                    <div class="form-group">
                        <label class="custom-select-label" for="customSelect">Friends only?</label>
                        <select class="custom-select" id="customSelect" onChange={this.onChangeFriendsOnly} value={this.state.friendsOnly} required>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>

                        <div class="invalid-feedback">Select a option.</div>
                    </div>
                    <div class="custom-control custom-checkbox mb-3">
                        <input type="checkbox" class="custom-control-input" id="customControlValidation1" required />
                        <label class="custom-control-label" for="customControlValidation1">Agree to our test enviroment terms.</label>
                        <div class="invalid-feedback">You must agree before you can create a contract.</div>
                    </div>
                    <div className="col-12 text-center">
                        <button className="btn btn-primary">Create Contract</button>
                    </div>
                </form>
            </div>
        )
    }

    buildContract = async (event) => {
        event.preventDefault();
        console.log(this.state);
        const instance = await createContract(this.props.account, this.props.factoryContract, this.state.etherAmount, this.state.amountOfParticipators, (this.state.openOnInit === "true"), (this.state.friendsOnly === "true"));
        this.setState({ contractAddress: instance });
        alert("succesfully created contract.");
        this.setState({
            etherAmount: "",
            amountOfParticipators: "",
            friendsOnly: false,
            openOnInit: true,
            
        })
        document.getElementById("customControlValidation1").checked = false;
    }
}


export default BetPage;