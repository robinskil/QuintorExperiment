import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
//import WeatherFactory from "../contracts/WeatherFactory.json";
// import WeatherBet from "../contracts/WeatherBet.json";
import getWeb3 from "../utils/getWeb3";
// import { createContract, getOwnedBets } from "../helpers/BettingFactory";
// import { getBetAmount, getParticipators, instantiateWeatherContract, joinBet } from "../helpers/BetContract";
import { MenuBar } from './Components/MenuBar';
import CreateBet from './CreateBetPage';
import ViewOwnBets from './ViewOwnBetsPage';


class Wrapper extends Component {
    constructor(props){
        super(props);
        this.state = {
            web3:null
        }
    }

    componentDidMount = async()=>{
        this.setState({web3: await getWeb3()})
    }

    render() {
        if(this.state.web3 ==null){
            return(
            <div className="row justify-content-center">
                <div className="col-12">
                    <h3 style={{textAlign:"center"}}>Loading web3 package... wait please.</h3>
                </div>
                <div className="col-12">
                    <h6 className="text-muted   " style={{textAlign:"center"}}>Before it can load , please log in using Metamask.</h6>
                </div>
                <div>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
            )
        }
        return (
            <Router>
                <div className="container">
                    <MenuBar />
                    <Route exact path="/" component={IndexPage} />
                    <Route path="/about" component={null} />
                    <Route path="/topics" component={null} />
                    <Route path="/CreateBet" component={()=>{return(<CreateBet web3={this.state.web3}/>)}}/>
                    <Route path="/ViewBets" component={()=>{return(<ViewOwnBets web3={this.state.web3}/>)}}/>
                </div>
            </Router>
        )
    }
}

class IndexPage extends Component {
    render() {
        return (
            <div class="jumbotron" style={{ padding: "2rem" }}>
                <h1 class="display-3">Welcome to Ethereum Betting!</h1>
                <p class="lead">Fully anonymous betting in your own control.</p>
                <hr class="my-4" />
                <div className="row justify-content-center">
                    <img width="50%" src="https://en.bitcoinwiki.org/upload/en/images/7/7a/Ethereum11.png" />
                </div>
                <Link style={{ marginTop: "30px" }} class="btn btn-primary" to="/LearnMore" role="button">Learn more</Link>
            </div>
        )
    }
}

export default Wrapper;