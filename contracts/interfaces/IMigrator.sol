//SPDX-License-Identifier: MIT
pragma solidity =0.8.24;

interface IMigrator {
    function migrate(
        address user,
        address[] calldata tokens,
        address destination,
        uint256[] calldata amounts
    ) external;
}
