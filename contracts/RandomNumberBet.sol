pragma solidity ^0.5.0;

import "./oraclizeAPI.sol";
import "./Bet.sol";
import "./IRandomNumberBet.sol";

//Todo Add events for winners
contract RandomNumberBet is Bet , IRandomNumberBet {
    uint amountOfGuesses;
    uint256 private randomNumber;
    mapping(address => uint[]) guesses;

    constructor(address _owner , uint _amount , uint _maxParticipators , bool _open , bool _friendsOnly , uint _betLength) public  {
        OAR = OraclizeAddrResolverI(0x8443A77A530dF747e77B913B77c81A98508Da8EC);
        require(_betLength > 0 && _maxParticipators <= 64 && _maxParticipators > 0);
        bet.creationTime = now;
        bet.owner = _owner;
        bet.betAmount = _amount;
        bet.maxParticipators = _maxParticipators;
        bet.open = _open;
        bet.friendsOnly = _friendsOnly;
        bet.finished = false;
        bet.betLength = (1 minutes * _betLength);
        betType = BetType.RandomNumberBet;
        amountOfGuesses = 3;
        getWinningNumber();
    }

    event LogRandomNumber(string price);
    
    //Function that is called after completion of the Oraclize query.
    function __callback(bytes32 myid, string memory result) public {
        if (msg.sender != oraclize_cbAddress()) revert();
        randomNumber = parseInt(result);
        //after the number has been decided , the winners will be decided.
        //TODO???
        //defineWinners();
        emit LogRandomNumber(result);
    }

    //Creates a random number by the use of a real world api through the query method.
    //TODO, Create mutex so it can only be done once
    function getWinningNumber() private  {
        //Query for the future , betlength = time in seconds after creation of the bet.
        oraclize_query(bet.betLength,"WolframAlpha", "random number between 1 and 10");
    }

    //Defines the winners
    function defineWinners() private returns (address[] memory){
        //loop through participants
        //use participants addresses to look up at in mapping
        for(uint x = 0 ; x < bet.participators.length ; x++){
            uint[] memory values = guesses[bet.participators[x]];
            for(uint y = 0 ; y<values.length;y++){
                if(values[y] == randomNumber){
                    bet.winners.push(bet.participators[x]);
                }
            }
        }
        divideWinnings();
        return bet.winners;
    }

    //Divide the balance among winners
    //TODO: If no winners, divide bet balance over all paricipants.
    function divideWinnings() private {
        uint part = address(this).balance / bet.winners.length;
        for(uint index = 0 ; index < bet.winners.length;index++){
            //Casting address to payable address
            address payable winner = address(uint160(bet.winners[index]));
            winner.transfer(part);
        }
        //bet has finished
        bet.finished = true;
    }

    //You cannot guess more than X times
    function guess(uint guessValue) public participating {
        require(guesses[msg.sender].length < amountOfGuesses , "Cannot guess more than 3 times");
        //require(userAlreadyJoined(msg.sender) == true);
        guesses[msg.sender].push(guessValue);
    }

    //Returns number of guesses left for this bet.
    function guessesLeft() public participating view returns(uint) {
        return guesses[msg.sender].length;
    }

    //gets the winning number , TODO , hide it from public.
    //Testing purposes only.
    function getRandomNumber() public view returns(uint){
        return randomNumber;
    }
}