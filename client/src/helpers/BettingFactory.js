/*These functions represent the contract factory*/


/**
 * Creates a new betting contract and returns an address of it.
 * @param {*} web3 
 * @param {*} accounts 
 * @param {*} factoryContract 
 */
export async function createWeatherBet(account , factoryContract , betAmount , maxParticipators , open , friendsOnly , betLength) {
    return await factoryContract.methods.createWeatherBet(betAmount, maxParticipators , open , friendsOnly , betLength).send({ from: account });
}

/**
 * Creates a new random number betting contract and returns an address of it.
 * @param {*} web3 
 * @param {*} accounts 
 * @param {*} factoryContract
 * @param {*} betLength length of the bet in minutes. 
 */
export async function createRandomNumberBet(account , factoryContract , betAmount , maxParticipators , open , friendsOnly , betLength) {
    return await factoryContract.methods.createRandomNumberBet(betAmount, maxParticipators , open , friendsOnly , betLength).send({ from: account });
}

/**
 * Gets all the bets for a specified user through the contract factory
 * @param {*} contract 
 * @param {*} accountAddress 
 */
export async function getOwnedBets(contract , accountAddress){
    return await contract.methods.getOwnedBets(accountAddress).call();
}