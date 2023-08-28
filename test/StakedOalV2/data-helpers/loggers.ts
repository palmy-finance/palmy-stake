import { tEthereumAddress } from '../../../helpers/types';
import { MintableErc20 } from '../../../types/MintableErc20';
import { StakedOasysLend } from '../../../types/StakedOasysLend';

export const logLayTokenBalanceOf = async (account: tEthereumAddress, token: MintableErc20) => {
  console.log(`[token.balanceOf(${account})]: ${(await token.balanceOf(account)).toString()}`);
};

export const logStakedTokenBalanceOf = async (
  staker: tEthereumAddress,
  StakedOasysLendV2: StakedOasysLend
) => {
  console.log(
    `[StakedOasysLendV2.balanceOf(${staker})]: ${(
      await StakedOasysLendV2.balanceOf(staker)
    ).toString()}`
  );
};

export const logGetStakeTotalRewardsBalance = async (
  staker: tEthereumAddress,
  StakedOasysLendV2: StakedOasysLend
) => {
  console.log(
    `[StakedOasysLendV2.getTotalRewardsBalance(${staker})]: ${(
      await StakedOasysLendV2.getTotalRewardsBalance(staker)
    ).toString()}`
  );
};
