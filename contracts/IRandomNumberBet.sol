pragma solidity ^0.5.0;


//Defines special features this type of bet requires for interaction with the user.
interface IRandomNumberBet {
    function guess(uint guessValue) external;
    function guessesLeft() external;
}