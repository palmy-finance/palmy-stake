import { BigNumber } from 'ethers';
import { DistributionManager } from '../../../types/DistributionManager';
import { StakedOasysLend } from '../../../types/StakedOasysLend';
import { IncentivesController } from '../../../types/IncentivesController';
import { StakedOasysLendV2 } from '../../../types/StakedOasysLendV2';

export type UserStakeInput = {
  underlyingAsset: string;
  stakedByUser: string;
  totalStaked: string;
};

export type UserPositionUpdate = UserStakeInput & {
  user: string;
};
export async function getUserIndex(
  distributionManager:
    | DistributionManager
    | IncentivesController
    | StakedOasysLend
    | StakedOasysLendV2,
  user: string,
  asset: string
): Promise<BigNumber> {
  return await distributionManager.getUserAssetData(user, asset);
}
