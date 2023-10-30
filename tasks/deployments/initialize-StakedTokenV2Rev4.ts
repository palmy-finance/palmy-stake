import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { notFalsyOrZeroAddress, waitForTx } from '../../helpers/misc-utils';
import {
  getStakedPalmyProxy,
  getStakedTokenV2Rev3,
  getStakedTokenV2Rev4,
} from '../../helpers/contracts-accessors';

const { StakedTokenV2Rev4 } = eContractid;

task(
  `initialize-${StakedTokenV2Rev4}`,
  `Initialize the ${StakedTokenV2Rev4} proxy contract`
).setAction(async ({}, localBRE) => {
  await localBRE.run('set-dre');

  if (!localBRE.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }

  console.log(`\n- ${StakedTokenV2Rev4} initialization`);

  const StakedPalmyImpl = await getStakedTokenV2Rev4();
  const StakedPalmyProxy = await getStakedPalmyProxy();

  if (!notFalsyOrZeroAddress(StakedPalmyImpl.address)) {
    throw new Error('missing StakedPalmyImpl');
  }
  if (!notFalsyOrZeroAddress(StakedPalmyProxy.address)) {
    throw new Error('missing StakedPalmyProxy');
  }

  console.log('\tInitializing StakedTokenV2Rev3');

  console.log(`\tStakedTokenV2Rev3 Implementation address: ${StakedPalmyImpl.address}`);

  const encodedInitializeStakedPalmy = StakedPalmyImpl.interface.encodeFunctionData('initialize');
  console.log('upgrade');
  await waitForTx(
    await StakedPalmyProxy.upgradeToAndCall(StakedPalmyImpl.address, encodedInitializeStakedPalmy)
  );

  console.log('\tFinished StakedTokenV2Rev3 and Transparent Proxy initialization');
});
