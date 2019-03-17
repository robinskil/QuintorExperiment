import React, { Component } from "react";
import "../../css/loading.css"
import PropTypes from 'prop-types';
import ethereumGreenIcon from "../../images/EthereumGreenIcon.png"
import "../../css/shake.css"
import "../../css/fade.css"
import "../../css/createBetPage.css"
import { setTimeout } from "timers";

export default class LoadingComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: false,
            succes: undefined,
            error: null
        }
    }
    //For testing purposes a 2 second delay through callback in timeout
    componentDidMount = async () => {
        let wait = async () => {
            try {
                await this.props.callback();
                await this.onSucces();
            }
            catch (exception) {
                await this.onFail(exception);
            }
        }
        setTimeout(wait, 4000);
    }

    onFail = async (exception) => {
        this.setState({ completed: true, succes: false, error: exception.message });
    }

    onSucces = async () => {
        this.setState({ completed: true, succes: true });
    }

    unmount = async () => {
        if (this.state.completed) {
            this.props.unmounting();
        }
    }

    render() {
        return (
            <div className="popup fade-in-signing-in" onClick={this.props.event}>
                <div className="popup_inner">
                    {!this.state.completed ? <LoadingSymbol /> : this.state.succes ?
                        <SuccesLoading message={this.props.succesMessage} unmount={this.unmount} /> : <FailedLoading error={this.state.error} unmount={this.unmount} />}
                </div>
            </div>
        )
    }
}

LoadingComponent.propTypes = {
    callback: PropTypes.func.isRequired
}

class LoadingSymbol extends Component {
    render() {
        return (
            <div className="justify-content-center align-items-center">
                <div className="row justify-content-center align-items-center">
                    <img src={ethereumGreenIcon} width={200} height={200} class="ping-rotate saturate" />
                </div>
                <div className="row justify-content-center align-items-center">
                    <h3 className="text-white">Loading</h3>
                </div>
            </div>
        )
    }
}

class SuccesLoading extends Component {
    render() {
        return (
            <div >
                <div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center" >
                    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" style={{ opacity: "1.0" }}>
                        <div class="toast-header">
                            <img src={ethereumGreenIcon} width={30} height={30} class="saturate" />
                            <strong class="mr-auto text-succes">Succes</strong>
                            <small>Just now</small>
                            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onClick={this.props.unmount}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="toast-body">
                            {this.props.succesMessage}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class FailedLoading extends Component {
    render() {
        return (
            <div>
                <div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center" >
                    <div class="toast fade-in-top" role="alert" aria-live="assertive" aria-atomic="true" style={{ opacity: "1.0" }}>
                        <div class="toast-header">
                            <img src={ethereumGreenIcon} width={30} height={30} class="wobble-hor-bottom" />
                            <strong class="mr-auto text-danger">Failed</strong>
                            <small>Just now</small>
                            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onClick={this.props.unmount}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="toast-body">
                            Error: {this.props.error}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}