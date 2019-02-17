pragma solidity ^0.5.0;

interface IWeatherBet {
    function getValue() external;
}

contract WeatherFactory {
    address[] public bets;

    function createWeatherBet(uint _value) public returns (address) {
        address betAddress = address(new WeatherBet(msg.sender , _value));
        bets.push(betAddress);
        return betAddress;
    }
    function getOwnedBets(address ownerAddress) public view returns (address[] memory) {
        address[] memory allBets = new address[](bets.length);
        uint256 currentIndice = 0;
        for (uint256 index = 0; index < bets.length; index++) {
            WeatherBet bet = WeatherBet(bets[index]);
            if (bet.getOwner() == ownerAddress) {
                allBets[currentIndice] = address(bet);
                currentIndice++;  
            }
        }
        address[] memory ownedBets = new address[](currentIndice);
        for(currentIndice ; currentIndice > 0; currentIndice--){
            ownedBets[currentIndice-1] = allBets[currentIndice-1]; 
        }
        return ownedBets;
    }
}
//abstract contract
contract Bet {
    struct BetStruct{
        address owner;
        address[] participators;
        uint betAmount;
    }
    BetStruct bet;

    function join() payable public {
        require(msg.value == bet.betAmount * 1 ether);
        bet.participators.push(msg.sender);
    }

    function getParticipators() public view returns  (address[] memory) {
        return bet.participators;
    }

    function getBetAmount() public view returns (uint) {
        return bet.betAmount;
    }

    function getOwner() public view returns (address) {
        return bet.owner;
    }

    function getStoredBalance() public view returns (uint256){
        return address(this).balance;
    }
    function defineWinners() public view returns (address[] memory);
}

contract WeatherBet is Bet, IWeatherBet {
    constructor(address _owner , uint _amount) public {
        bet.owner = _owner;
        bet.betAmount = _amount;
    }
    //Everyone is a winner
    function defineWinners() public view returns (address[] memory) {
        return bet.participators;
    }
    function getValue() public view returns(uint){
        return 5;
    }
}