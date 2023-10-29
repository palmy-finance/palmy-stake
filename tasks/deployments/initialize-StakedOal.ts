import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { waitForTx } from '../../helpers/misc-utils';
import {
  ZERO_ADDRESS,
  STAKED_TOKEN_NAME,
  STAKED_TOKEN_SYMBOL,
  STAKED_TOKEN_DECIMALS,
} from '../../helpers/constants';
import { getStakedOasysLendImpl, getStakedOasysLendProxy } from '../../helpers/contracts-accessors';

const { StakedOasysLend: StakedOasysLend } = eContractid;

task(`initialize-${StakedOasysLend}`, `Initialize the ${StakedOasysLend} proxy contract`)
  .addParam(
    'admin',
    `The address to be added as an Admin role in ${StakedOasysLend} Transparent Proxy.`
  )
  .setAction(async ({ admin: oalAdmin }, localBRE) => {
    await localBRE.run('set-dre');

    if (!oalAdmin) {
      throw new Error(
        `Missing --admin parameter to add the Admin Role to ${StakedOasysLend} Transparent Proxy`
      );
    }

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- ${StakedOasysLend} initialization`);

    const StakedOasysLendImpl = await getStakedOasysLendImpl();
    const StakedOasysLendProxy = await getStakedOasysLendProxy();

    console.log('\tInitializing StakedOasysLend');

    const encodedInitializeStakedOasysLend = StakedOasysLendImpl.interface.encodeFunctionData(
      'initialize',
      [ZERO_ADDRESS, STAKED_TOKEN_NAME, STAKED_TOKEN_SYMBOL, STAKED_TOKEN_DECIMALS]
    );

    await waitForTx(
      await StakedOasysLendProxy.functions['initialize(address,address,bytes)'](
        StakedOasysLendImpl.address,
        oalAdmin,
        encodedInitializeStakedOasysLend
      )
    );

    console.log('\tFinished Oal Token and Transparent Proxy initialization');
  });
