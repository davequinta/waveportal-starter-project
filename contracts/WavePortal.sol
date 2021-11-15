// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract AnimePortal {
    uint256 totalAnimes;

    /*
     * We will be using this below to help generate a random number
     */
    uint256 private seed;

    /*
     * A little magic, Google what events are in Solidity!
     */
    event NewAnime(address indexed from, uint256 timestamp, string anime);

    /*
     * I created a struct here named Wave.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Anime {
        address waver; // The address of the user who waved.
        string anime; // The anime url
        uint256 timestamp; // The timestamp when the user waved.
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Anime[] animes;
    /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */
    mapping(address => uint256) public lastDropedAt;

    constructor() payable {
        console.log("Yet Another Smart Contract!");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function subAnime(string memory _anime) public {
        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        require(
            lastDropedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastDropedAt[msg.sender] = block.timestamp;

        totalAnimes += 1;
        console.log("%s has sent their fav anime :)!", msg.sender);

        /*
         * This is where I actually store the wave data in the array.
         */
        animes.push(Anime(msg.sender, _anime, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            /*
             * The same code we had before to send the prize.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        /*
         * I added some fanciness here, Google it and try to figure out what it is!
         * Let me know what you learn in #general-chill-chat
         */
        emit NewAnime(msg.sender, block.timestamp, _anime);
    }

    /*
     * I added a function getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllAnimes() public view returns (Anime[] memory) {
        return animes;
    }

    function getTotalAnimes() public view returns (uint256) {
        console.log("We have %d total animes submitted!", totalAnimes);
        return totalAnimes;
    }
}
