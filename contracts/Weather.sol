pragma solidity ^0.5.0;
//TODO import oracles through oraclize

interface IWeatherBet {
    function getValue() external;
}

//Our factory contract , this is deployed by us as developers.
contract WeatherFactory {
    address[] public bets;

    function createWeatherBet(uint _value , uint _maxParticipators , bool _open , bool _friendsOnly) public returns (address) {
        address betAddress = address(new WeatherBet(msg.sender , _value , _maxParticipators , _open , _friendsOnly));
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
        for(uint256 index = 0 ; index < currentIndice; index++){
            ownedBets[index] = allBets[index]; 
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
        uint maxParticipators;
        bool open;
        bool friendsOnly;
        bool finished;
    }
    BetStruct bet;

    //todo check if user is already in list....
    function join() payable public {
        require(bet.open == true , "Bet is not open at the moment.");
        require(msg.value == bet.betAmount * 1 ether  , "Requires Ether.");
        bet.participators.push(msg.sender);
    }

    function isOpen() public view returns(bool){
        return bet.open;
    }

    function friendsOnly() public view returns(bool){
        return bet.friendsOnly;
    }

    function finished() public view returns(bool){
        return bet.finished;
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
    
    function finishBet() public returns (address[] memory){
        address[] memory holder  = defineWinners();
        bet.finished = true;
        return holder;
    }
    function defineWinners() private returns (address[] memory);
}

contract WeatherBet is Bet, IWeatherBet {
    constructor(address _owner , uint _amount , uint _maxParticipators , bool _open , bool _friendsOnly) public {
        bet.owner = _owner;
        bet.betAmount = _amount;
        bet.maxParticipators = _maxParticipators;
        bet.open = _open;
        bet.friendsOnly = _friendsOnly;
        bet.finished = false;
    }
    //Everyone is a winner
    function defineWinners() private returns (address[] memory) {
        return bet.participators;
    }
    function getValue() public view returns(uint){
        return 5;
    }
}