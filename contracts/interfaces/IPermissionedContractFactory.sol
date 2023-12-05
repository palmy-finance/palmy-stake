pragma solidity ^0.7.5;

interface IPermissionedContractFactory {
  function getDeploymentAddress(
    bytes calldata bytecode,
    bytes32 salt
  ) external view returns (address addr);
}
