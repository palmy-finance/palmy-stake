import { task } from 'hardhat/config';

import { eAstarNetwork, eContractid, eEthereumNetwork } from '../../helpers/types';
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
  deployStakedOasysLend,
  deployInitializableAdminUpgradeabilityProxy,
} from '../../helpers/contracts-accessors';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ethers } from 'hardhat';

const { StakedOasysLend, StakedOasysLendImpl } = eContractid;

task(`deploy-${StakedOasysLend}`, `Deploys the ${StakedOasysLend} contract`)
  .addFlag('verify', 'Verify StakedToken contract via Etherscan API.')
  .addOptionalParam(
    'vaultAddress',
    'Use IncentivesVault address by param instead of configuration.'
  )
  .addOptionalParam('tokenAddress', 'Use OalToken address by param instead of configuration.')
  .setAction(async ({ verify, vaultAddress, tokenAddress }, localBRE) => {
    await localBRE.run('set-dre');

    // If Etherscan verification is enabled, check needed enviroments to prevent loss of gas in failed deployments.
    if (verify) {
      checkVerification();
    }

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    const network = localBRE.network.name as eEthereumNetwork | eAstarNetwork;

    console.log(`\n- ${StakedOasysLend} deployment`);

    console.log(`\tDeploying ${StakedOasysLend} implementation ...`);
    const admin = getAdminPerNetwork(network);
    const StakedOasysLendImpl = await deployStakedOasysLend(
      [
        tokenAddress || getTokenPerNetwork(network),
        tokenAddress || getTokenPerNetwork(network),
        getCooldownSecondsPerNetwork(network),
        getUnstakeWindowPerNetwork(network),
        vaultAddress || getIncentivesVaultPerNetwork(network),
        '0xed81c007113D8E532954B735B683260776F3c297', // admin, // emissionManager
        getDistributionDurationPerNetwork(network),
      ],
      false // disable verify due not supported by current buidler etherscan plugin
    );
    await StakedOasysLendImpl.deployTransaction.wait();
    await registerContractInJsonDb(StakedOasysLendImpl, StakedOasysLendImpl);

    console.log(`\tDeploying ${StakedOasysLend} Transparent Proxy ...`);
    const stakedTokenProxy = await deployInitializableAdminUpgradeabilityProxy(
      verify,
      await getEthersSigners()[0]
    );
    await registerContractInJsonDb(StakedOasysLend, stakedTokenProxy);

    console.log(`\tFinished ${StakedOasysLend} proxy and implementation deployment`);
  });
