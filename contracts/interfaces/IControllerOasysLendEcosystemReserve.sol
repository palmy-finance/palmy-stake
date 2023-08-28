pragma solidity ^0.7.5;

interface IControllerOasysLendEcosystemReserve {
  function approve(
    address token,
    address recipient,
    uint256 amount
  ) external;
}
