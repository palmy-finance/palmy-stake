import { tEthereumAddress } from '../../../helpers/types';
import { MintableErc20 } from '../../../types/MintableErc20';
import { StakedOas } from '../../../types/StakedOas';

export const logLayTokenBalanceOf = async (account: tEthereumAddress, token: MintableErc20) => {
  console.log(`[token.balanceOf(${account})]: ${(await token.balanceOf(account)).toString()}`);
};

export const logStakedTokenBalanceOf = async (staker: tEthereumAddress, stakedToken: StakedOas) => {
  console.log(
    `[stakedToken.balanceOf(${staker})]: ${(await stakedToken.balanceOf(staker)).toString()}`
  );
};

export const logGetStakeTotalRewardsBalance = async (
  staker: tEthereumAddress,
  StakedOas: StakedOas
) => {
  console.log(
    `[StakedOas.getTotalRewardsBalance(${staker})]: ${(
      await StakedOas.getTotalRewardsBalance(staker)
    ).toString()}`
  );
};
