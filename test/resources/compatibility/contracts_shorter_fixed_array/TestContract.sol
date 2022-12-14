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

  uint128[4] fixedArray;
  uint256[] array;
  mapping(uint256 => mapping(uint128 => address[])) map;

  Thing public thing;
}
