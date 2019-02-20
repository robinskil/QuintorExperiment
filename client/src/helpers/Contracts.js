
/**
 * Creates a new betting contract and returns an address of it.
 * @param {*} web3 
 * @param {*} accounts 
 * @param {*} factoryContract 
 */
export async function createContract(account , factoryContract , betAmount , maxParticipators , open , friendsOnly) {
    return await factoryContract.methods.createWeatherBet(betAmount, maxParticipators , open , friendsOnly).send({ from: account });
}

/**
 * Gets all the bets for a specified user through the contract factory
 * @param {*} contract 
 * @param {*} accountAddress 
 */
export async function getOwnedBets(contract , accountAddress){
    return await contract.methods.getOwnedBets(accountAddress).call();
}