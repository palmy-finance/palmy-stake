import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { waitForTx } from '../../helpers/misc-utils';
import {
  ZERO_ADDRESS,
  STAKED_TOKEN_NAME,
  STAKED_TOKEN_SYMBOL,
  STAKED_TOKEN_DECIMALS,
} from '../../helpers/constants';
import { getStakedOasImpl, getStakedOasProxy } from '../../helpers/contracts-accessors';

const { StakedOas: StakedOas } = eContractid;

task(`initialize-${StakedOas}`, `Initialize the ${StakedOas} proxy contract`)
  .addParam('admin', `The address to be added as an Admin role in ${StakedOas} Transparent Proxy.`)
  .setAction(async ({ admin: plmyAdmin }, localBRE) => {
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

    const encodedInitializeStakedOas = StakedOasImpl.interface.encodeFunctionData('initialize', [
      ZERO_ADDRESS,
      STAKED_TOKEN_NAME,
      STAKED_TOKEN_SYMBOL,
      STAKED_TOKEN_DECIMALS,
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
