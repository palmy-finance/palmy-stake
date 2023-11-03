import { task } from 'hardhat/config';
import { eOasysNetwork, eContractid, eEthereumNetwork } from '../../helpers/types';
import { waitForTx } from '../../helpers/misc-utils';
import {
  ZERO_ADDRESS,
  STAKED_TOKEN_NAME,
  STAKED_TOKEN_SYMBOL,
  STAKED_TOKEN_DECIMALS,
  getTokenPerNetwork,
  getIncentivesVaultPerNetwork,
} from '../../helpers/constants';
import { getStakedOasImpl, getStakedOasProxy } from '../../helpers/contracts-accessors';

const { StakedOas: StakedOas } = eContractid;

task(`initialize-${StakedOas}`, `Initialize the ${StakedOas} proxy contract`)
  .addParam('admin', `The address to be added as an Admin role in ${StakedOas} Transparent Proxy.`)
  .addOptionalParam(
    'vaultAddress',
    'Use IncentivesVault address by param instead of configuration.'
  )
  .addOptionalParam('tokenAddress', 'Use WOasToken address by param instead of configuration.')
  .setAction(async ({ admin: plmyAdmin, vaultAddress, tokenAddress }, localBRE) => {
    await localBRE.run('set-dre');

    if (!plmyAdmin) {
      throw new Error(
        `Missing --admin parameter to add the Admin Role to ${StakedOas} Transparent Proxy`
      );
    }

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
        plmyAdmin,
        encodedInitializeStakedOas
      )
    );

    console.log('\tFinished WOal Token and Transparent Proxy initialization');
  });
