import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { waitForTx } from '../../helpers/misc-utils';
import {
  ZERO_ADDRESS,
  STAKED_TOKEN_NAME,
  STAKED_TOKEN_SYMBOL,
  STAKED_TOKEN_DECIMALS,
} from '../../helpers/constants';
import { getStakedPalmyImpl, getStakedPalmyProxy } from '../../helpers/contracts-accessors';

const { StakedPalmy: StakedPalmy } = eContractid;

task(`initialize-${StakedPalmy}`, `Initialize the ${StakedPalmy} proxy contract`)
  .addParam(
    'admin',
    `The address to be added as an Admin role in ${StakedPalmy} Transparent Proxy.`
  )
  .setAction(async ({ admin: plmyAdmin }, localBRE) => {
    await localBRE.run('set-dre');

    if (!plmyAdmin) {
      throw new Error(
        `Missing --admin parameter to add the Admin Role to ${StakedPalmy} Transparent Proxy`
      );
    }

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- ${StakedPalmy} initialization`);

    const StakedPalmyImpl = await getStakedPalmyImpl();
    const StakedPalmyProxy = await getStakedPalmyProxy();

    console.log('\tInitializing StakedPalmy');

    const encodedInitializeStakedPalmy = StakedPalmyImpl.interface.encodeFunctionData(
      'initialize',
      [ZERO_ADDRESS, STAKED_TOKEN_NAME, STAKED_TOKEN_SYMBOL, STAKED_TOKEN_DECIMALS]
    );

    await waitForTx(
      await StakedPalmyProxy.functions['initialize(address,address,bytes)'](
        StakedPalmyImpl.address,
        plmyAdmin,
        encodedInitializeStakedPalmy
      )
    );

    console.log('\tFinished Oal Token and Transparent Proxy initialization');
  });
