import { task } from 'hardhat/config';
import { eOasysNetwork, eContractid, eEthereumNetwork } from '../../helpers/types';
import { waitForTx } from '../../helpers/misc-utils';
import {
  ZERO_ADDRESS,
  getTokenPerNetwork,
  getIncentivesVaultPerNetwork,
  getAdminPerNetwork,
} from '../../helpers/constants';
import { getStakedOasImpl, getStakedOasProxy } from '../../helpers/contracts-accessors';

const { StakedOas: StakedOas } = eContractid;

task(`initialize-${StakedOas}`, `Initialize the ${StakedOas} proxy contract`)
  .addOptionalParam(
    'vaultAddress',
    'Use IncentivesVault address by param instead of configuration.'
  )
  .addOptionalParam('tokenAddress', 'Use WOasToken address by param instead of configuration.')
  .setAction(async ({ vaultAddress, tokenAddress }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- ${StakedOas} initialization`);

    const StakedOasImpl = await getStakedOasImpl();
    const StakedOasProxy = await getStakedOasProxy();

    console.log('\tInitializing StakedOas');
    const network = localBRE.network.name as eEthereumNetwork | eOasysNetwork;

    const encodedInitializeStakedOas = StakedOasImpl.interface.encodeFunctionData('initialize', [
      ZERO_ADDRESS,
      tokenAddress || getTokenPerNetwork(network),
      tokenAddress || getTokenPerNetwork(network),
      vaultAddress || getIncentivesVaultPerNetwork(network),
    ]);

    await waitForTx(
      await StakedOasProxy.functions['initialize(address,address,bytes)'](
        StakedOasImpl.address,
        await getAdminPerNetwork(network),
        encodedInitializeStakedOas
      )
    );

    console.log('\tFinished StakedOAS Token and Transparent Proxy initialization');
  });
