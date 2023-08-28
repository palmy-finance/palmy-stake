import { evmRevert, evmSnapshot, DRE } from '../../helpers/misc-utils';
import { Signer } from 'ethers';
import { getEthersSigners } from '../../helpers/contracts-helpers';
import { tEthereumAddress } from '../../helpers/types';

import chai from 'chai';
// @ts-ignore
import bignumberChai from 'chai-bignumber';
import { StakedOasysLend } from '../../types/StakedOasysLend';
import {
  getIncentivesController,
  getATokenMock,
  getMintableErc20,
  getStakedOasysLend,
  getStakedOasysLendV2,
} from '../../helpers/contracts-accessors';
import { IncentivesController } from '../../types/IncentivesController';
import { MintableErc20 } from '../../types/MintableErc20';
import { ATokenMock } from '../../types/ATokenMock';
import { StakedOasysLendV2 } from '../../types/StakedOasysLendV2';

chai.use(bignumberChai());

export let stakedTokenInitializeTimestamp = 0;
export const setStakedTokenInitializeTimestamp = (timestamp: number) => {
  stakedTokenInitializeTimestamp = timestamp;
};

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface TestEnv {
  stakedTokenV2: StakedOasysLendV2;
  rewardsVault: SignerWithAddress;
  deployer: SignerWithAddress;
  users: SignerWithAddress[];
  oalToken: MintableErc20;
  incentivesController: IncentivesController;
  stakedToken: StakedOasysLend;
  aDaiMock: ATokenMock;
  aWethMock: ATokenMock;
}

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
  if (DRE.network.name === 'hardhat') {
    buidlerevmSnapshotId = id;
  }
};

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  oalToken: {} as MintableErc20,
  stakedToken: {} as StakedOasysLend,
  stakedTokenV2: {} as StakedOasysLendV2,
  incentivesController: {} as IncentivesController,
  aDaiMock: {} as ATokenMock,
  aWethMock: {} as ATokenMock,
} as TestEnv;

export async function initializeMakeSuite() {
  const [_deployer, _rewardsVault, ...restSigners] = await getEthersSigners();
  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  const rewardsVault: SignerWithAddress = {
    address: await _rewardsVault.getAddress(),
    signer: _rewardsVault,
  };

  for (const signer of restSigners) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }
  testEnv.deployer = deployer;
  testEnv.rewardsVault = rewardsVault;
  testEnv.stakedToken = await getStakedOasysLend();
  testEnv.stakedTokenV2 = await getStakedOasysLendV2();
  testEnv.incentivesController = await getIncentivesController();
  testEnv.oalToken = await getMintableErc20();
  testEnv.aDaiMock = await getATokenMock({ slug: 'lDai' });
  testEnv.aWethMock = await getATokenMock({ slug: 'lWeth' });
}

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      setBuidlerevmSnapshotId(await evmSnapshot());
    });
    tests(testEnv);
    after(async () => {
      await evmRevert(buidlerevmSnapshotId);
    });
  });
}
