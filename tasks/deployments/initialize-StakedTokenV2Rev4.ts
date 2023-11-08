import { task } from 'hardhat/config';
import { eContractid, eEthereumNetwork, eOasysNetwork } from '../../helpers/types';
import { notFalsyOrZeroAddress, waitForTx } from '../../helpers/misc-utils';
import {
  getStakedOasProxy,
  getStakedTokenV2Rev3,
  getStakedTokenV2Rev4,
} from '../../helpers/contracts-accessors';
import { getIncentivesVaultPerNetwork, getTokenPerNetwork } from '../../helpers/constants';

const { StakedTokenV2Rev4 } = eContractid;

task(`initialize-${StakedTokenV2Rev4}`, `Initialize the ${StakedTokenV2Rev4} proxy contract`)
  .addOptionalParam(
    'vaultAddress',
    'Use IncentivesVault address by param instead of configuration.'
  )
  .addOptionalParam('tokenAddress', 'Use OalToken address by param instead of configuration.')
  .setAction(async ({ tokenAddress, vaultAddress }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }
    const network = localBRE.network.name as eEthereumNetwork | eOasysNetwork;

    console.log(`\n- ${StakedTokenV2Rev4} initialization`);

    const StakedOasImpl = await getStakedTokenV2Rev4();
    const StakedOasProxy = await getStakedOasProxy();
    const token = tokenAddress || getTokenPerNetwork(network);
    const vault = vaultAddress || getIncentivesVaultPerNetwork(network);
    if (!notFalsyOrZeroAddress(token)) {
      throw new Error('mising token address');
    }
    if (!notFalsyOrZeroAddress(vault)) {
      throw new Error('mising vault address');
    }
    if (!notFalsyOrZeroAddress(StakedOasImpl.address)) {
      throw new Error('missing StakedOasImpl');
    }
    if (!notFalsyOrZeroAddress(StakedOasProxy.address)) {
      throw new Error('missing StakedOasProxy');
    }

    console.log('\tInitializing StakedTokenV2Rev3');

    console.log(`\tStakedTokenV2Rev4 Implementation address: ${StakedOasImpl.address}`);

    const encodedInitializeStakedOas = StakedOasImpl.interface.encodeFunctionData('initialize', [
      token,
      token,
      vault,
    ]);
    console.log('upgrade');
    await waitForTx(
      await StakedOasProxy.upgradeToAndCall(StakedOasImpl.address, encodedInitializeStakedOas)
    );

    console.log('\tFinished StakedTokenV2Rev3 and Transparent Proxy initialization');
  });
