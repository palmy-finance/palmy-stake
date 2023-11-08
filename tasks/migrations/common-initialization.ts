import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { eContractid, eEthereumNetwork, eOasysNetwork } from '../../helpers/types';
import { checkVerification } from '../../helpers/etherscan-verification';
import { getAdminPerNetwork } from '../../helpers/constants';
require('dotenv').config();

task('common-initialization', 'Initialize contracts').setAction(async ({}, localBRE) => {
  const DRE: HardhatRuntimeEnvironment = await localBRE.run('set-dre');
  const network = DRE.network.name as eEthereumNetwork | eOasysNetwork;
  await DRE.run(`initialize-${eContractid.StakedOas}`, {});
  await DRE.run(`initialize-${eContractid.StakedTokenV2Rev4}`, {});
  console.log(`\n✔️ Finished the initialization of the StakedOas Token ${network} Enviroment. ✔️`);
});
