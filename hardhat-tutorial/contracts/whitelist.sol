// SPDX-License-Identifier:MIT
pragma solidity ^0.8.18;

contract whitelist {
    uint public maxWhitelistedAddress;
    mapping(address => bool) public whitelistedAddress;
    uint public numWhitelistedAddress;
    
    constructor(uint maxWhitelistedAddress_) {
        maxWhitelistedAddress = maxWhitelistedAddress_;
    }

    function addAddresstoWhiteList() public{
        require(!whitelistedAddress[msg.sender],"Already Whitelisted");
        require(numWhitelistedAddress < maxWhitelistedAddress,"Limit reached");
        whitelistedAddress[msg.sender] = true;
        numWhitelistedAddress += 1;
    }
}