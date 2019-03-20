import React, { Component } from "react";
import { instantiateContract, getBetAmount, getParticipators, joinBet, getTimeLeft, getCreationTime, getOwner, getBetType, isOpen } from "../helpers/Bet.js";
import RandomNumberBet from "../contracts/RandomNumberBet.json";


export default class JoinBetPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            accounts: null,
            address:undefined,
            contract:null
        }
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.checkIfExists = this.checkIfExists.bind(this);
        this.checkOpen = this.checkOpen.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.tryJoinBet = this.tryJoinBet.bind(this);
    }

    componentWillMount = async() => {
        const accounts = await this.props.web3.eth.getAccounts();
        this.setState({accounts:accounts});
    }

    submitForm(event){
        event.preventDefault();
        this.tryJoinBet();
    }

    tryJoinBet = async() =>{
        const amount = await getBetAmount(this.state.contract);
        await joinBet(this.state.contract,this.state.accounts[0],amount , this.props.web3);
    }

    onChangeAddress = (event) => {
        console.log(event.target.value);
        const address = event.target.value;
        this.setState({address:address});
        this.validateInput(address);
    }

    checkIfExists = async(address) =>{
        try {
            const instance = await instantiateContract(this.props.web3, RandomNumberBet, address)
            return instance;
        } catch (error) {
            return null;
        }
    }

    checkOpen = async(contract) =>{
        try {
            return await isOpen(contract);
        } catch (error) {
            return false;
        }
    }

    async validateInput(address) {
        if(address.length == 40 || address.length == 42){
            var contract = await this.checkIfExists(address);
        }
        if (contract != null) {
            //Check if open
            if(await this.checkOpen(contract)){
                document.getElementById("joinInput").classList.remove("is-invalid");
                document.getElementById("joinInput").classList.add("is-valid");
                document.getElementById("joinButton").disabled = false;
                this.setState({contract:contract})
                console.log("Valid");
            }
            //contract is not open at this moment
            else {
                document.getElementById("joinInput").classList.remove("is-valid");
                document.getElementById("joinInput").classList.add("is-invalid");
                document.getElementById("joinButton").disabled = true;
                document.getElementById("joinFeedback").innerHTML = "This bet is not open at this point in time."
                this.setState({contract:null})
            }
        }
        //contract does not exist
        else {
            document.getElementById("joinInput").classList.remove("is-valid");
            document.getElementById("joinInput").classList.add("is-invalid");
            document.getElementById("joinButton").disabled = true;
            document.getElementById("joinFeedback").innerHTML = "Please fill in an existing bet address."
            this.setState({contract:null})
        }
    }

    render() {
        return (
            <div>
                <div className="row justify-content-center slide-in-blurred-left">
                    <form onSubmit={this.submitForm}>
                        <div class="form-group">
                            <label for="validationServer01">Join bet by Address</label>
                            <input type="text" class="form-control is-invalid" id="joinInput" value={this.state.address} onChange={this.onChangeAddress} />
                            <div class="invalid-feedback" id="joinFeedback">
                                Please fill in an existing bet address.
                            </div>
                        </div>
                        <button className="btn btn-primary" id="joinButton" disabled>
                            Join
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}


//TODO: Create a component that display betting info

class BetInfo extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                
            </div>
        )
    }
}