pragma solidity ^0.5.0;

interface IWeatherBet {
    function getValue() external;
}

contract WeatherFactory {
    address[] public bets;

    function createWeatherBet(uint _value) public {
        bets.push(address(new WeatherBet(msg.sender , _value)));
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