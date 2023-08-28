import { tEthereumAddress } from '../../../helpers/types';
import { MintableErc20 } from '../../../types/MintableErc20';
import { StakedOasysLend } from '../../../types/StakedOasysLend';

export const logLayTokenBalanceOf = async (account: tEthereumAddress, token: MintableErc20) => {
  console.log(`[token.balanceOf(${account})]: ${(await token.balanceOf(account)).toString()}`);
};

export const logStakedTokenBalanceOf = async (
  staker: tEthereumAddress,
  stakedToken: StakedOasysLend
) => {
  console.log(
    `[stakedToken.balanceOf(${staker})]: ${(await stakedToken.balanceOf(staker)).toString()}`
  );
};

export const logGetStakeTotalRewardsBalance = async (
  staker: tEthereumAddress,
  StakedOasysLend: StakedOasysLend
) => {
  console.log(
    `[StakedOasysLend.getTotalRewardsBalance(${staker})]: ${(
      await StakedOasysLend.getTotalRewardsBalance(staker)
    ).toString()}`
  );
};
