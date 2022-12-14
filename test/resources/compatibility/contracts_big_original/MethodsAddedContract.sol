//SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.0;

contract MethodsAddedContract {
  uint256 i = 3;

  function someMethod1(uint256 u) external {
    i = u;
  }

  function someMethod2(uint256 s) external pure returns (uint256) {
    return s + 1;
  }
}
