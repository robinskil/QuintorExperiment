/*Allows for interaction with the Specialized Random number bet*/
/**
 * Gets the winning random number from the contract...
 * TODO: Delete this function when going live.
 * @param {*} contract 
 */
export async function getRandomNumber(contract){
    return await contract.methods.getRandomNumber().call();
}
    
/**
 * Taking a guess at a random number bet.
 * @param {*} contract 
 * @param {*} account 
 * @param {*} value 
 */
export async function guess(contract , account , value){
    return await contract.methods.guess(value).send({from: account});
}