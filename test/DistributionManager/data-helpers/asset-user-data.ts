import { BigNumber } from 'ethers';
import { DistributionManager } from '../../../types/DistributionManager';
import { StakedPalmy } from '../../../types/StakedPalmy';
import { IncentivesController } from '../../../types/IncentivesController';
import { StakedPalmyV2 } from '../../../types/StakedPalmyV2';

export type UserStakeInput = {
  underlyingAsset: string;
  stakedByUser: string;
  totalStaked: string;
};

export type UserPositionUpdate = UserStakeInput & {
  user: string;
};
export async function getUserIndex(
  distributionManager: DistributionManager | IncentivesController | StakedPalmy | StakedPalmyV2,
  user: string,
  asset: string
): Promise<BigNumber> {
  return await distributionManager.getUserAssetData(user, asset);
}
