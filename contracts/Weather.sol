pragma solidity ^0.5.0;
// //TODO import oracles through oraclize
// import "./oraclizeAPI.sol";


// interface IWeatherBet {
//     function getValue() external;
// }

// //Will be needed to create bets through composition.
// //Our factory contract , this is deployed by us as developers.
// contract BettingFactory {
//     address[] public bets;

//     //Instantiates a new Weather bet
//     function createWeatherBet(uint _value , uint _maxParticipators , bool _open , bool _friendsOnly , uint _betLength) public returns (address) {
//         address betAddress = address(new WeatherBet(msg.sender , _value , _maxParticipators , _open , _friendsOnly , _betLength));
//         bets.push(betAddress);
//         return betAddress;
//     }

//     //Instantiates a new Random Number Bet
//     function createRandomBet(uint _value , uint _maxParticipators , bool _open , bool _friendsOnly , uint _betLength) public returns (address){
//         address betAddress = address(new RandomNumberBet(msg.sender , _value , _maxParticipators , _open , _friendsOnly , _betLength));
//         bets.push(betAddress);
//         return betAddress;
//     }

//     //Gets all current bets that a user has.
//     function getOwnedBets(address ownerAddress) public view returns (address[] memory) {
//         address[] memory allBets = new address[](bets.length);
//         uint256 currentIndice = 0;
//         for (uint256 index = 0; index < bets.length; index++) {
//             WeatherBet bet = WeatherBet(bets[index]);
//             if (bet.getOwner() == ownerAddress) {
//                 allBets[currentIndice] = address(bet);
//                 currentIndice++;  
//             }
//         }
//         address[] memory ownedBets = new address[](currentIndice);
//         for(uint256 index = 0 ; index < currentIndice; index++){
//             ownedBets[index] = allBets[index]; 
//         }
//         return ownedBets;
//     }
// }
//abstract contract that is used by any specilized bet.
//Force winners to be filled in before make get winners request.
// contract Bet is usingOraclize {
//     struct BetStruct{
//         //time of creation of the bet
//         uint creationTime;
//         //betting length in days.
//         uint betLength;
//         address owner;
//         address[] participators;
//         address[]  winners;
//         uint betAmount;
//         uint maxParticipators;  
//         bool open;
//         bool friendsOnly;
//         bool finished;
//     }
//     BetStruct bet;

//     modifier onlyOwner {
//         require(
//             msg.sender == bet.owner,
//             "Only owner can call this function."
//         );
//         _;
//     }

//     //Guard to define whether a bet has finished.
//     modifier betFinished{
//         require( bet.finished == true); 
//         _;
//     }

//     //guard to define whether a sender is participating.
//     modifier participating{
//         require( userAlreadyJoined(msg.sender) == true , "You have to join this bet first.");
//         _;
//     }
    
//     //todo check if user is already in list....
//     function join() payable public {
//         require(msg.value == bet.betAmount * 1 ether  , "Requires Ether.");
//         require(bet.open == true);
//         require(userAlreadyJoined(msg.sender) == false);
//         bet.participators.push(msg.sender);
//     }

//     function userAlreadyJoined(address userAddress) private view returns (bool){
//         for (uint index = 0 ; index < bet.participators.length; index++) {
//             if(bet.participators[index] == userAddress) return true;
//         }
//         return false;
//     }

//     function isOpen() public view returns(bool){
//         return bet.open;
//     }

//     function friendsOnly() public onlyOwner view returns(bool){
//         return bet.friendsOnly;
//     }

//     function finished() public view returns(bool){
//         return bet.finished;
//     }

//     function getParticipators() public view returns  (address[] memory) {
//         return bet.participators;
//     }

//     function getBetAmount() public view returns (uint) {
//         return bet.betAmount;
//     }

//     function getOwner() public view returns (address) {
//         return bet.owner;
//     }

//     function getStoredBalance() public view returns (uint256) {
//         return address(this).balance;
//     }
    
//     //Add modifier
//     function getWinners() public betFinished view returns(address[] memory) {
//         return bet.winners;
//     }

//     function getCreationTime() public view returns(uint){
//         return bet.creationTime; 
//     }

//     //returns time left in seconds for bet to end
//     function timeLeft() public view returns(uint) {
//         return (bet.creationTime - now) / (bet.betLength * 1 minutes);
//     }
    
//     /*ABSTRACT FUNCTIONS*/
//     //Functions that need to be implemented by inherited contracts.
//     function defineWinners() private returns (address[] memory);
//     function divideWinnings() private;
// }

// contract WeatherBet is Bet {
//     //betlength in minutes
//     constructor(address _owner , uint _amount , uint _maxParticipators , bool _open , bool _friendsOnly , uint _betLength) public {
//         bet.creationTime = now;
//         bet.owner = _owner;
//         bet.betAmount = _amount;
//         bet.maxParticipators = _maxParticipators;
//         bet.open = _open;
//         bet.friendsOnly = _friendsOnly;
//         bet.finished = false;
//         bet.betLength = (1 minutes * _betLength);
//     }
//     //Everyone is a winner
//     function defineWinners() private returns (address[] memory) {
//         return bet.participators;
//     }
//     function divideWinnings() private{
        
//     }
//     function getValue() public view returns(uint){
//         return 5;
//     }
// }

// //Defines special features this type of bet requires for interaction with the user.
// interface IRandomNumberBet {
//     function guess(uint guessValue) external;
// }

// //Todo Add events for winners
// contract RandomNumberBet is Bet , IRandomNumberBet {
//     //Todo , make private/local
//     uint256 private randomNumber;
//     mapping(address => uint[]) guesses;

//     constructor(address _owner , uint _amount , uint _maxParticipators , bool _open , bool _friendsOnly , uint _betLength) public  {
//         OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
//         require(_betLength > 0 && _maxParticipators <= 64 && _maxParticipators > 0);
//         bet.creationTime = now;
//         bet.owner = _owner;
//         bet.betAmount = _amount;
//         bet.maxParticipators = _maxParticipators;
//         bet.open = _open;
//         bet.friendsOnly = _friendsOnly;
//         bet.finished = false;
//         bet.betLength = (1 minutes * _betLength);
//         createRandomNumber();
//     }

//     event LogRandomNumber(string price);
    
//     //Function that is called after completion of the Oraclize query.
//     function __callback(bytes32 myid, string memory result) public {
//         if (msg.sender != oraclize_cbAddress()) revert();
//         randomNumber = parseInt(result);
//         //after the number has been decided , the winners will be decided.
//         //TODO???
//         defineWinners();
//         emit LogRandomNumber(result);
//     }

//     //Creates a random number by the use of a real world api through the query method.
//     //TODO, Create mutex so it can only be done once
//     function createRandomNumber() private {
//         //Query for the future , betlength = time in minutes after creation of the bet.
//         oraclize_query(bet.betLength,"WolframAlpha", "random number between 1 and 10");
//     }

//     //You cannot guess more than 3 times
//     function guess(uint guessValue) public participating {
//         require(guesses[msg.sender].length < 3 , "Cannot guess more than 3 times");
//         //require(userAlreadyJoined(msg.sender) == true);
//         guesses[msg.sender].push(guessValue);
//     }

//     //Defines the winners
//     function defineWinners() private returns (address[] memory){
//         //loop through participants
//         //use participants addresses to look up at in mapping
//         for(uint x = 0 ; x < bet.participators.length ; x++){
//             uint[] memory values = guesses[bet.participators[x]];
//             for(uint y = 0 ; y<values.length;y++){
//                 if(values[y] == randomNumber){
//                     bet.winners.push(bet.participators[x]);
//                 }
//             }
//         }
//         divideWinnings();
//         return bet.winners;
//     }

//     //Divide the balance among winners
//     function divideWinnings() private {
//         uint part = address(this).balance / bet.winners.length;
//         for(uint index = 0 ; index < bet.winners.length;index++){
//             //Casting address to payable address
//             address payable winner = address(uint160(bet.winners[index]));
//             winner.transfer(part);
//         }
//         //bet has finished
//         bet.finished = true;
//     }

//     //gets the winning number , TODO , hide it from public.
//     //Testing purposes only.
//     function getRandomNumber() public view returns(uint){
//         return randomNumber;
//     }
// }