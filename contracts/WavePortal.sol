// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract AnimePortal {
    uint256 totalAnimes;

    constructor() {
        console.log("Yet Another Smart Contract!");
    }

    function subAnime() public {
        totalAnimes += 1;
        console.log("%s has sent their fav anime :)!", msg.sender);
    }

    function getTotalAnimes() public view returns (uint256) {
        console.log("We have %d total animes submitted!", totalAnimes);
        return totalAnimes;
    }
}
