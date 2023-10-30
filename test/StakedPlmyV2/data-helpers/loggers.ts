import { tEthereumAddress } from '../../../helpers/types';
import { MintableErc20 } from '../../../types/MintableErc20';
import { StakedPalmy } from '../../../types/StakedPalmy';

export const logLayTokenBalanceOf = async (account: tEthereumAddress, token: MintableErc20) => {
  console.log(`[token.balanceOf(${account})]: ${(await token.balanceOf(account)).toString()}`);
};

export const logStakedTokenBalanceOf = async (
  staker: tEthereumAddress,
  StakedPalmyV2: StakedPalmy
) => {
  console.log(
    `[StakedPalmyV2.balanceOf(${staker})]: ${(await StakedPalmyV2.balanceOf(staker)).toString()}`
  );
};

export const logGetStakeTotalRewardsBalance = async (
  staker: tEthereumAddress,
  StakedPalmyV2: StakedPalmy
) => {
  console.log(
    `[StakedPalmyV2.getTotalRewardsBalance(${staker})]: ${(
      await StakedPalmyV2.getTotalRewardsBalance(staker)
    ).toString()}`
  );
};
