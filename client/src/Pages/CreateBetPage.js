import React, { Component } from "react";
import BettingFactory from "../contracts/BettingFactory.json";
import { createRandomNumberBet, getOwnedBets } from "../helpers/BettingFactory";
import { getBetAmount, getParticipators, instantiateWeatherContract, joinBet } from "../helpers/BetContract";
import ethereumGreenIcon from "../images/EthereumGreenIcon.png"
import "../css/createBetPage.css"
import LoadingComponent from "./Components/LoadingComponent.js";
import { throws } from "assert";

class CreateBet extends Component {
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
                    Welcome: {this.state.accounts[0]}
                </h4>
                {this.state.factoryContract != null ?
                    <CreateBetForm web3={this.props.web3} account={this.state.accounts[0]} factoryContract={this.state.factoryContract} />
                    : null}

            </div>
        )
    }
}

class CreateBetForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            etherAmount: null,
            amountOfParticipators: null,
            friendsOnly: "false",
            openOnInit: "true",
            betLength: undefined,
            closeOnTime: undefined,
            betType: "RandomNumber",
            buildingContract: false
        }
        this.buildContract = this.buildContract.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.unmountLoading = this.unmountLoading.bind(this);
        this.onChangeEther = this.onChangeEther.bind(this);
        this.onChangeFriendsOnly = this.onChangeFriendsOnly.bind(this);
        this.onChangeOpenOnInit = this.onChangeOpenOnInit.bind(this);
        this.onChangeParticipators = this.onChangeParticipators.bind(this);
        this.onChangeBetLength = this.onChangeBetLength.bind(this);
        this.onChangeBetType = this.onChangeBetType.bind(this);
    }
    onChangeBetLength(event) {
        this.setState({ betLength: event.target.value });
    }
    onChangeEther(event) {
        this.setState({ etherAmount: event.target.value });
    }
    onChangeParticipators(event) {
        this.setState({ amountOfParticipators: event.target.value });
    }
    onChangeFriendsOnly(event) {
        this.setState({ friendsOnly: event.target.value });
    }
    onChangeOpenOnInit(event) {
        this.setState({ openOnInit: event.target.value });
    }
    onChangeBetType(event) {
        this.setState({ betType: event.target.value });
    }
    render() {
        return (
            <div>
                <div className="row justify-content-center slide-in-blurred-left">
                    <div className="col-6">
                        <div className="card text-center ">
                            <div class="card-header">
                                <img src={ethereumGreenIcon} width={30} height={30} class="ping-rotate icon-location saturate" />
                                Creating a Bet
                            </div>
                            <div class="card-body">
                                <form class="was-validated" onSubmit={this.submitForm}>
                                    <div class="form-group">
                                        <label class="custom-select-label" for="customSelect">Type of Bet</label>
                                        <select class="custom-select" id="customSelect" onChange={this.onChangeBetType} value={this.state.betType} required>
                                            <option value="RandomNumber">Random Number</option>
                                        </select>

                                        <div class="invalid-feedback">Select a option.</div>
                                    </div>
                                    <div class="form-group">
                                        <label for="validationServer01">Amount of Ether</label>
                                        <input type="number" class="form-control" id="validationServer01" min={1} value={this.state.etherAmount} onChange={this.onChangeEther} required />
                                        <div class="invalid-feedback">
                                            Please fill in a amount of ether you want to bet.
                                </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="validationServer01">Max participators</label>
                                        <input type="number" class="form-control" id="validationServer01" min={1} max={64} value={this.state.amountOfParticipators} onChange={this.onChangeParticipators} required />
                                        <div class="invalid-feedback">
                                            Please fill the max amount of participators (Maximum = 64).
                                </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="validationServer01">Fill in how long the bet lasts for(in minutes)</label>
                                        <input type="number" class="form-control" id="validationServer01" min={1} value={this.state.betLength} onChange={this.onChangeBetLength} required />
                                        <div class="invalid-feedback">
                                            Please fill in the number of minutes u want the bet to last for(Minimum of 1 minutes).
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
                            <div class="card-footer text-muted">
                                Disclaimer: This is strictly for developing purposes.
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.buildingContract ? <LoadingComponent callback={this.buildContract} unmounting={this.unmountLoading} succesMessage={"Succesfully created a bet"}/> : null}
            </div>

        )
    }

    submitForm = (event) =>{
        this.setState({buildingContract:true});
        event.preventDefault();
    }

    unmountLoading(){
        this.setState({buildingContract: false});
    }

    buildContract = async () => {
        console.log(this.state);
        await createRandomNumberBet(this.props.account, this.props.factoryContract, this.state.etherAmount,
            this.state.amountOfParticipators, (this.state.openOnInit === "true"),
            (this.state.friendsOnly === "true"), this.state.betLength)
        //alert("succesfully created contract.");
        await this.resetForm();
    }

    resetForm = async () => {
        this.setState({
            etherAmount: "",
            amountOfParticipators: "",
            friendsOnly: false,
            openOnInit: true,
            betLength: "",
        });
        document.getElementById("customControlValidation1").checked = false;
    }
}


export default CreateBet;