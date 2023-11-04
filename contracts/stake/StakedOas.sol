// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.5;
pragma experimental ABIEncoderV2;

import {IERC20} from '../interfaces/IERC20.sol';
import {StakedToken} from './StakedToken.sol';
import {ITransferHook} from '../interfaces/ITransferHook.sol';

/**
 * @title StakedOas
 * @notice StakedToken with WOAS token as staked token
 * @author Palmy finance
 **/
contract StakedOas is StakedToken {
  string internal constant NAME = 'Staked OAS';
  string internal constant SYMBOL = 'sOAS';
  uint8 internal constant DECIMALS = 18;

  constructor(
    uint256 cooldownSeconds,
    uint256 unstakeWindow,
    address emissionManager,
    uint128 distributionDuration
  )
    public
    StakedToken(
      cooldownSeconds,
      unstakeWindow,
      emissionManager,
      distributionDuration,
      NAME,
      SYMBOL,
      DECIMALS
    )
  {}

  function initialize(
    ITransferHook governance,
    address stakedToken,
    address rewardToken,
    address rewardsVault
  ) external initializer {
    _initialize(governance, NAME, SYMBOL, DECIMALS, stakedToken, rewardToken, rewardsVault);
  }
}
