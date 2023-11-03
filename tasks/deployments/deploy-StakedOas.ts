import { task } from 'hardhat/config';

import { eOasysNetwork, eContractid, eEthereumNetwork } from '../../helpers/types';
import { getEthersSigners, registerContractInJsonDb } from '../../helpers/contracts-helpers';
import {
  getTokenPerNetwork,
  getCooldownSecondsPerNetwork,
  getUnstakeWindowPerNetwork,
  getAdminPerNetwork,
  getDistributionDurationPerNetwork,
  getIncentivesVaultPerNetwork,
} from '../../helpers/constants';
import {
  deployStakedOas,
  deployInitializableAdminUpgradeabilityProxy,
} from '../../helpers/contracts-accessors';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ethers } from 'hardhat';

const { StakedOas, StakedOasImpl } = eContractid;

task(`deploy-${StakedOas}`, `Deploys the ${StakedOas} contract`)
  .addFlag('verify', 'Verify StakedToken contract via Etherscan API.')
  .setAction(async ({ verify, vaultAddress, tokenAddress }, localBRE) => {
    await localBRE.run('set-dre');

    // If Etherscan verification is enabled, check needed enviroments to prevent loss of gas in failed deployments.
    if (verify) {
      checkVerification();
    }

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    const network = localBRE.network.name as eEthereumNetwork | eOasysNetwork;

    console.log(`\n- ${StakedOas} deployment`);

    console.log(`\tDeploying ${StakedOas} implementation ...`);
    const admin = getAdminPerNetwork(network);
    const stakedPalmyImpl = await deployStakedOas(
      [
        getCooldownSecondsPerNetwork(network),
        getUnstakeWindowPerNetwork(network),
        '0xed81c007113D8E532954B735B683260776F3c297', // admin, // emissionManager
        getDistributionDurationPerNetwork(network),
      ],
      false // disable verify due not supported by current buidler etherscan plugin
    );
    await stakedPalmyImpl.deployTransaction.wait();
    await registerContractInJsonDb(StakedOasImpl, stakedPalmyImpl);

    console.log(`\tDeploying ${StakedOas} Transparent Proxy ...`);
    const stakedTokenProxy = await deployInitializableAdminUpgradeabilityProxy(
      verify,
      await getEthersSigners()[0]
    );
    await registerContractInJsonDb(StakedOas, stakedTokenProxy);

    console.log(`\tFinished ${StakedOas} proxy and implementation deployment`);
  });
