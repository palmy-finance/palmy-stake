import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { notFalsyOrZeroAddress, waitForTx } from '../../helpers/misc-utils';
import { getStakedOasysLendProxy, getStakedTokenV2Rev3 } from '../../helpers/contracts-accessors';

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

  const StakedOasysLendImpl = await getStakedTokenV2Rev3();
  const StakedOasysLendProxy = await getStakedOasysLendProxy();

  if (!notFalsyOrZeroAddress(StakedOasysLendImpl.address)) {
    throw new Error('missing StakedOasysLendImpl');
  }
  if (!notFalsyOrZeroAddress(StakedOasysLendProxy.address)) {
    throw new Error('missing StakedOasysLendProxy');
  }

  console.log('\tInitializing StakedTokenV2Rev3');

  console.log(`\tStakedTokenV2Rev3 Implementation address: ${StakedOasysLendImpl.address}`);

  const encodedInitializeStakedOasysLend = StakedOasysLendImpl.interface.encodeFunctionData(
    'initialize'
  );
  console.log('upgrade');
  await waitForTx(
    await StakedOasysLendProxy.upgradeToAndCall(
      StakedOasysLendImpl.address,
      encodedInitializeStakedOasysLend
    )
  );

  console.log('\tFinished StakedTokenV2Rev3 and Transparent Proxy initialization');
});
