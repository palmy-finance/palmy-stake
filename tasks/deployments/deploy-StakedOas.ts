import { task } from 'hardhat/config';

import { eOasysNetwork, eContractid, eEthereumNetwork } from '../../helpers/types';
import { deploy } from '../../helpers/contracts-accessors';

const { StakedOas, StakedOasImpl } = eContractid;

task(`deploy-${StakedOas}`, `Deploys the ${StakedOas} contract`).setAction(async ({}, localBRE) => {
  await localBRE.run('set-dre');
  const network = localBRE.network.name as eEthereumNetwork | eOasysNetwork;
  await deploy(eContractid.StakedOas, network);
  await deploy(eContractid.StakedOasImpl, network);

  console.log(`\tFinished ${StakedOas} proxy and implementation deployment`);
});
