import { task } from 'hardhat/config';

import { eContractid, eEthereumNetwork } from '../../helpers/types';
import { verifyContract } from '../../helpers/etherscan-verification';
import {
  getDeployArgs,
  getStakedOas,
  getStakedOasImpl,
  getStakedTokenV2Rev4,
} from '../../helpers/contracts-accessors';
require('dotenv').config();

task('verification', 'Verify contracts').setAction(async ({}, localBRE) => {
  await localBRE.run('set-dre');
  if (!localBRE.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }
  const network = localBRE.network.name as eEthereumNetwork;

  await verifyContract((await getStakedOas()).address, []);
  await verifyContract(
    (
      await getStakedOasImpl()
    ).address,
    await getDeployArgs(network, eContractid.StakedOas)
  );
  await verifyContract(
    (
      await getStakedTokenV2Rev4()
    ).address,
    await getDeployArgs(network, eContractid.StakedTokenV2Rev4)
  );
  console.log('\n✔️ Finished verification. ✔️');
});
