import { task } from 'hardhat/config';

import { eOasysNetwork, eContractid, eEthereumNetwork } from '../../helpers/types';
import { getEthersSigners, registerContractInJsonDb } from '../../helpers/contracts-helpers';
import {
  getCooldownSecondsPerNetwork,
  getUnstakeWindowPerNetwork,
  getAdminPerNetwork,
  getDistributionDurationPerNetwork,
} from '../../helpers/constants';
import {
  deployStakedOas,
  deployInitializableAdminUpgradeabilityProxy,
  deploy,
} from '../../helpers/contracts-accessors';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ethers } from 'hardhat';

const { StakedOas, StakedOasImpl } = eContractid;

task(`deploy-${StakedOas}`, `Deploys the ${StakedOas} contract`).setAction(async ({}, localBRE) => {
  await localBRE.run('set-dre');
  const network = localBRE.network.name as eEthereumNetwork | eOasysNetwork;
  await deploy(eContractid.StakedOas, network);
  await deploy(eContractid.StakedOasImpl, network);

  console.log(`\tFinished ${StakedOas} proxy and implementation deployment`);
});
