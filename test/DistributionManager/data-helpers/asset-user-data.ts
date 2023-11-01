import { BigNumber } from 'ethers';
import { DistributionManager } from '../../../types/DistributionManager';
import { StakedOas } from '../../../types/StakedOas';
import { IncentivesController } from '../../../types/IncentivesController';
import { StakedOasV2 } from '../../../types/StakedOasV2';

export type UserStakeInput = {
  underlyingAsset: string;
  stakedByUser: string;
  totalStaked: string;
};

export type UserPositionUpdate = UserStakeInput & {
  user: string;
};
export async function getUserIndex(
  distributionManager: DistributionManager | IncentivesController | StakedOas | StakedOasV2,
  user: string,
  asset: string
): Promise<BigNumber> {
  return await distributionManager.getUserAssetData(user, asset);
}
