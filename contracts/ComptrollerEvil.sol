pragma solidity ^0.5.8;

import "./Comptroller.sol";

contract ComptrollerEvil is Comptroller {
    function redeemAllowedInternal(address cToken, address redeemer, uint redeemTokens) internal view returns (uint) {
        return uint(Error.NO_ERROR);
    }

    function borrowAllowed(address cToken, address borrower, uint borrowAmount) external returns (uint) {
        return uint(Error.NO_ERROR);
    }
}
