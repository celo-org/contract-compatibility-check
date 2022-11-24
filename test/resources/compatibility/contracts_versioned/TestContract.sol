//SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.0;

import "./TestParent.sol";

contract TestContract is TestParent {
  struct Thing {
    uint128 a;
    uint128 b;
    uint128 c;
  }

  uint256 public x;
  address public z;

  Thing public thing;

  function getVersionNumber() external pure returns (uint256, uint256, uint256, uint256) {
    return (1, 2, 3, 4);
  }
}