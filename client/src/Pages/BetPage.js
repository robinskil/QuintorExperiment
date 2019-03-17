import React, { Component } from "react";
import { instantiateContract, getBetAmount, getParticipators, joinBet, getTimeLeft, getCreationTime, getOwner, getBetType } from "../helpers/Bet.js";
import RandomNumberBet from "../contracts/RandomNumberBet.json";
import { getRandomNumber } from "../helpers/RandomNumberBet.js";

export default class BetPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            betType: undefined,
            instance: null,
        }
    }

    componentWillMount = async () => {
        const instance = await instantiateContract(this.props.web3, RandomNumberBet, this.props.match.params.betAddress);
        const betType = this.betTypeName(await getBetType(instance));
        console.log(instance);
        this.setState({ instance: instance, betType: betType });
    }

    betTypeName(betType) {
        if (betType == 0) {
            return "Random Number Bet";
        }
        else return null;
    }

    render() {
        return (
            <div className="container">
                <h4>{this.state.betType}</h4>
                <small>Address: {this.props.match.params.betAddress}</small>
                <div className="row">
                    {this.state.instance ? <Participators instance={this.state.instance} /> : null}
                </div>
            </div>
        )
    }
}

class Participators extends Component {
    constructor(props) {
        super(props);
        this.state = {
            participators: null,
            owner: null
        }
        this.counter = 0;
        this.filterParticipators = this.filterParticipators.bind(this);
    }

    componentWillMount = async () => {
        console.log("Instance: " + this.props.instance._address);
        const participators = await getParticipators(this.props.instance);
        const owner = await getOwner(this.props.instance);
        const filteredParticipators = this.filterParticipators(participators);
        this.setState({ participators: filteredParticipators, owner: owner });
        console.log(filteredParticipators);
        console.log(owner);
    }

    filterParticipators = (participators, owner) => {
        // let indexToBeRemoved;
        // for (let index = 0; index < participators.length; index++) {
        //     const address = participators[index];
        //     if (address === owner) {
        //         indexToBeRemoved = index;
        //     }
        // }
        return participators.splice(participators.indexOf(owner), 1);
    }

    render() {
        if (this.state.participators && this.state.owner) {
            return (
                <div>
                    <h6>Bet owned by: {this.state.owner}</h6>
                    <table class="table">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Player Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.participators.map(participator => {
                                this.counter++;
                                return (
                                    <tr>
                                        <th scope="row">{this.counter}</th>
                                        <td>{participator}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )
        }
        return null;
    }
}

class RandomNumberBetComponent extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>

            </div>
        )
    }
}