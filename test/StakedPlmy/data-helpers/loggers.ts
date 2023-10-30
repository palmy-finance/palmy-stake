import { tEthereumAddress } from '../../../helpers/types';
import { MintableErc20 } from '../../../types/MintableErc20';
import { StakedPalmy } from '../../../types/StakedPalmy';

export const logLayTokenBalanceOf = async (account: tEthereumAddress, token: MintableErc20) => {
  console.log(`[token.balanceOf(${account})]: ${(await token.balanceOf(account)).toString()}`);
};

export const logStakedTokenBalanceOf = async (
  staker: tEthereumAddress,
  stakedToken: StakedPalmy
) => {
  console.log(
    `[stakedToken.balanceOf(${staker})]: ${(await stakedToken.balanceOf(staker)).toString()}`
  );
};

export const logGetStakeTotalRewardsBalance = async (
  staker: tEthereumAddress,
  StakedPalmy: StakedPalmy
) => {
  console.log(
    `[StakedPalmy.getTotalRewardsBalance(${staker})]: ${(
      await StakedPalmy.getTotalRewardsBalance(staker)
    ).toString()}`
  );
};
