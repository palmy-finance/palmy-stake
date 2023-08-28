// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.5;
pragma experimental ABIEncoderV2;

import {IERC20} from '../interfaces/IERC20.sol';
import {StakedToken} from './StakedToken.sol';

/**
 * @title StakedOasysLend
 * @notice StakedToken with OAL token as staked token
 * @author HorizonX.tech
 **/
contract StakedOasysLend is StakedToken {
  string internal constant NAME = 'Staked OasysLend';
  string internal constant SYMBOL = 'sOAL';
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
