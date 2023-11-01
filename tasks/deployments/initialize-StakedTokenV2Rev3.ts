import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { notFalsyOrZeroAddress, waitForTx } from '../../helpers/misc-utils';
import { getStakedOasProxy, getStakedTokenV2Rev3 } from '../../helpers/contracts-accessors';

const { StakedTokenV2Rev3 } = eContractid;

task(
  `initialize-${StakedTokenV2Rev3}`,
  `Initialize the ${StakedTokenV2Rev3} proxy contract`
).setAction(async ({}, localBRE) => {
  await localBRE.run('set-dre');

  if (!localBRE.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }

  console.log(`\n- ${StakedTokenV2Rev3} initialization`);

  const StakedOasImpl = await getStakedTokenV2Rev3();
  const StakedOasProxy = await getStakedOasProxy();

  if (!notFalsyOrZeroAddress(StakedOasImpl.address)) {
    throw new Error('missing StakedOasImpl');
  }
  if (!notFalsyOrZeroAddress(StakedOasProxy.address)) {
    throw new Error('missing StakedOasProxy');
  }

  console.log('\tInitializing StakedTokenV2Rev3');

  console.log(`\tStakedTokenV2Rev3 Implementation address: ${StakedOasImpl.address}`);

  const encodedInitializeStakedOas = StakedOasImpl.interface.encodeFunctionData('initialize');
  console.log('upgrade');
  await waitForTx(
    await StakedOasProxy.upgradeToAndCall(StakedOasImpl.address, encodedInitializeStakedOas)
  );

  console.log('\tFinished StakedTokenV2Rev3 and Transparent Proxy initialization');
});
