import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { eContractid, eEthereumNetwork, eOasysNetwork } from '../../helpers/types';
import { checkVerification } from '../../helpers/etherscan-verification';
import { getAdminPerNetwork } from '../../helpers/constants';
import { printContracts } from '../../helpers/contracts-accessors';
require('dotenv').config();

task('common-deployment', 'Deployment in for Main, Kovan networks').setAction(
  async ({ verify }, localBRE) => {
    const DRE: HardhatRuntimeEnvironment = await localBRE.run('set-dre');
    const network = DRE.network.name as eEthereumNetwork | eOasysNetwork;
    const admin = getAdminPerNetwork(network);

    if (!admin) {
      throw Error(
        'The --admin parameter must be set. Set an Ethereum address as --admin parameter input.'
      );
    }

    // If Etherscan verification is enabled, check needed enviroments to prevent loss of gas in failed deployments.
    if (verify) {
      checkVerification();
    }

    await DRE.run(`export-deploy-calldata-${eContractid.StakedOas}`, {});
    await DRE.run(`export-deploy-calldata-${eContractid.StakedTokenV2Rev4}`, {});
    if (network === eOasysNetwork.oasys) {
      console.log(`\n✔️ Finished the deployment of the Oas Token ${network} Enviroment. ✔️`);
      return;
    }
    await DRE.run(`deploy-${eContractid.StakedOas}`, {});
    await DRE.run(`deploy-${eContractid.StakedTokenV2Rev4}`, {});
    console.log(`\n✔️ Finished the deployment of the Oas Token ${network} Enviroment. ✔️`);
    printContracts();
  }
);
