// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.5;
pragma experimental ABIEncoderV2;

import {IERC20} from '../interfaces/IERC20.sol';
import {StakedToken} from './StakedToken.sol';

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
    address stakedToken,
    address rewardToken,
    uint256 cooldownSeconds,
    uint256 unstakeWindow,
    address rewardsVault,
    address emissionManager,
    uint128 distributionDuration
  )
    public
    StakedToken(
      stakedToken,
      rewardToken,
      cooldownSeconds,
      unstakeWindow,
      rewardsVault,
      emissionManager,
      distributionDuration,
      NAME,
      SYMBOL,
      DECIMALS
    )
  {}
}
