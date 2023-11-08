import { task } from 'hardhat/config';

import { eOasysNetwork, eContractid, eEthereumNetwork } from '../../helpers/types';
import {
  getEthersSigners,
  registerContractInJsonDb,
  saveDeploymentCallData,
} from '../../helpers/contracts-helpers';
import {
  getCooldownSecondsPerNetwork,
  getUnstakeWindowPerNetwork,
  getAdminPerNetwork,
  getDistributionDurationPerNetwork,
} from '../../helpers/constants';
import {
  exportStakedOasDeploymentCallData,
  exportInitializableAdminUpgradeabilityProxyDeploymentCallData,
} from '../../helpers/contracts-accessors';

const { StakedOas, StakedOasImpl } = eContractid;

task(
  `export-deploy-calldata-${StakedOas}`,
  `Export deployment calldata of the ${StakedOas} contract`
).setAction(async ({}, localBRE) => {
  await localBRE.run('set-dre');

  const network = localBRE.network.name as eEthereumNetwork | eOasysNetwork;
  console.log(`\n- ${StakedOas} exporting...`);
  console.log(`\Exporting ${StakedOas} calldata ...`);
  const stakedOas = await exportStakedOasDeploymentCallData();
  await saveDeploymentCallData(StakedOasImpl, stakedOas);

  console.log(`\Exporting ${StakedOas} transparent proxy calldata ...`);

  const stakedOasProxy = await exportInitializableAdminUpgradeabilityProxyDeploymentCallData();
  await saveDeploymentCallData(StakedOas, stakedOasProxy);

  console.log(`\tFinished ${StakedOas} proxy and implementation exporting`);
});
