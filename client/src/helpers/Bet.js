/*Allows for interaction with the base bet methods
  These methods can be found in {Contract: Bet(Abstract)} */

/**
 * Instantiates a bet through the use of abi.
 * @param {*} web3 
 * @param {*} betJson 
 * @param {*} betAddress 
 * @returns An instantiated betting contract. 
 */
export async function instantiateContract(web3 , betJson , betAddress){
    return new web3.eth.Contract(
        betJson.abi,
        betAddress
        )
}

/**
 * Allows an end user to join an instantiated contract.
 * @param {*} contract 
 * @param {*} account 
 * @param {*} amount 
 * @param {*} web3 
 */
export async function joinBet(contract , account , amount , web3){
    return await contract.methods.join().send({ from: account , value: web3.utils.toWei( amount.toString() , 'ether')});
}

/**
 * gets the amount to join the bet.
 * @param {*} contract 
 */
export async function getBetAmount(contract){
    return await contract.methods.getBetAmount().call();
}

/**
 * Gets the type of a bet , EX: RandomNumberBet
 * @param {*} contract 
 */
export async function getBetType(contract){
    return await contract.methods.betType().call();
}

/**
 * get the participators of an instantiated contract.
 * @param {*} contract 
 * @returns {[]} returns an array of partipators
 */
export async function getParticipators(contract){
    return await contract.methods.getParticipators().call();
}

/**
 * Checks if the bet is open to join
 * @param {*} contract 
 * @returns {true} if bet is open to join
 * @returns {false} if bet is closed
 */
export async function isOpen(contract){
    return await contract.methods.isOpen().call();
}

/**
 * checks if the bet is open to friendsOnly
 * @requires Owner of the bet
 * @param {*} contract 
 * @returns {true} if the bets is only open to friends.
 * @returns {false} if the bets is open to all.
 */
export async function friendsOnly(contract){
    return await contract.methods.friendsOnly().call();
}

/**
 * checks if the bet has finished or not.
 * @param {*} contract 
 * @returns {true} true if the bet has finished.
 * @returns {false} false if the bet hasnt finished yet.
 */
export async function finished(contract){
    return await contract.methods.finished().call();
}


/**
 * TODO: Specify return type (ex: wei , finney , etc)
 * Gets the prize pool of the bet.
 * @param {*} contract 
 * @returns price pool of the bet in ??????
 */
export async function getPrizePool(contract){
    return await contract.methods.getStoredBalance().call();
}

/**
 * Gets the winners of the bet.
 * @requires {the bet to be finished}
 * @param {*} contract
 * @returns {[]} returns an array of the addresses that contain the winners 
 */
export async function getWinners(contract){
    return await contract.methods.getWinners().call();
}

/**
 * gets the creation time of the bet.
 * @param {*} contract 
 * @returns the creation time of the bet in seconds from 1970 =>
 */
export async function getCreationTime(contract){
    return await contract.methods.getCreationTime().call();
}

/**
 * gets the time left on the bet in seconds.
 * @param {*} contract 
 * @returns time in seconds left.
 */
export async function getTimeLeft(contract){
    return await contract.methods.timeLeft().call();
}

/**
 * Gets the owner of a bet.
 * @param {*} contract 
 */
export async function getOwner(contract){
    return await contract.methods.getOwner().call();
}