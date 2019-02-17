
export async function getBetAmount(contract){
    return await contract.methods.getBetAmount().call();
}

export async function getParticipators(contract){
    return await contract.methods.getParticipators().call();
}

export async function joinBet(contract , account , amount , web3){
    return await contract.methods.join().send({ from: account , value: web3.utils.toWei( amount.toString() , 'ether')});
}

export async function instantiateWeatherContract(web3 , betJson , betAddress){
    return new web3.eth.Contract(
        betJson.abi,
        betAddress
        )
}
