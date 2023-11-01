import { tEthereumAddress } from '../../../helpers/types';
import { MintableErc20 } from '../../../types/MintableErc20';
import { StakedOas } from '../../../types/StakedOas';

export const logLayTokenBalanceOf = async (account: tEthereumAddress, token: MintableErc20) => {
  console.log(`[token.balanceOf(${account})]: ${(await token.balanceOf(account)).toString()}`);
};

export const logStakedTokenBalanceOf = async (staker: tEthereumAddress, StakedOasV2: StakedOas) => {
  console.log(
    `[StakedOasV2.balanceOf(${staker})]: ${(await StakedOasV2.balanceOf(staker)).toString()}`
  );
};

export const logGetStakeTotalRewardsBalance = async (
  staker: tEthereumAddress,
  StakedOasV2: StakedOas
) => {
  console.log(
    `[StakedOasV2.getTotalRewardsBalance(${staker})]: ${(
      await StakedOasV2.getTotalRewardsBalance(staker)
    ).toString()}`
  );
};
