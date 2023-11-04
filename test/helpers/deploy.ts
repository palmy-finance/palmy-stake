import { Signer } from 'ethers';
import {
  PSM_STAKER_PREMIUM,
  COOLDOWN_SECONDS,
  UNSTAKE_WINDOW,
  STAKED_TOKEN_NAME,
  STAKED_TOKEN_SYMBOL,
  STAKED_TOKEN_DECIMALS,
  MAX_UINT_AMOUNT,
  ZERO_ADDRESS,
} from '../../helpers/constants';
import {
  deployInitializableAdminUpgradeabilityProxy,
  deployIncentivesController,
  deployStakedOas,
  deployMockTransferHook,
  deployStakedOasV2,
  deployStakedTokenV2Revision3,
  deployStakedTokenV2Revision4,
} from '../../helpers/contracts-accessors';
import { insertContractAddressInDb } from '../../helpers/contracts-helpers';
import { waitForTx } from '../../helpers/misc-utils';
import { eContractid } from '../../helpers/types';
import { MintableErc20 } from '../../types/MintableErc20';

export const testDeployStakedOasV1 = async (
  token: MintableErc20,
  deployer: Signer,
  vaultOfRewards: Signer,
  restWallets: Signer[]
) => {
  const proxyAdmin = await restWallets[0].getAddress();
  const emissionManager = await deployer.getAddress();

  const stakedToken = token.address;
  const rewardsToken = token.address;

  const vaultOfRewardsAddress = await vaultOfRewards.getAddress();

  const incentivesControllerProxy = await deployInitializableAdminUpgradeabilityProxy();
  const StakedOasProxy = await deployInitializableAdminUpgradeabilityProxy();

  const incentivesControllerImplementation = await deployIncentivesController([
    token.address,
    vaultOfRewardsAddress,
    StakedOasProxy.address,
    PSM_STAKER_PREMIUM,
    emissionManager,
    (1000 * 60 * 60).toString(),
  ]);

  const StakedOasImpl = await deployStakedOas([
    COOLDOWN_SECONDS,
    UNSTAKE_WINDOW,
    emissionManager,
    (1000 * 60 * 60).toString(),
  ]);

  const mockTransferHook = await deployMockTransferHook();

  const StakedOasEncodedInitialize = StakedOasImpl.interface.encodeFunctionData('initialize', [
    mockTransferHook.address,
    stakedToken,
    rewardsToken,
    vaultOfRewardsAddress,
  ]);
  await StakedOasProxy['initialize(address,address,bytes)'](
    StakedOasImpl.address,
    proxyAdmin,
    StakedOasEncodedInitialize
  );
  await waitForTx(
    await token.connect(vaultOfRewards).approve(StakedOasProxy.address, MAX_UINT_AMOUNT)
  );
  await insertContractAddressInDb(eContractid.StakedOas, StakedOasProxy.address);

  const peiEncodedInitialize =
    incentivesControllerImplementation.interface.encodeFunctionData('initialize');
  await incentivesControllerProxy['initialize(address,address,bytes)'](
    incentivesControllerImplementation.address,
    proxyAdmin,
    peiEncodedInitialize
  );
  await waitForTx(
    await token.connect(vaultOfRewards).approve(incentivesControllerProxy.address, MAX_UINT_AMOUNT)
  );
  await insertContractAddressInDb(
    eContractid.IncentivesController,
    incentivesControllerProxy.address
  );

  return {
    incentivesControllerProxy,
    StakedOasProxy,
  };
};

export const testDeployStakedOasV2 = async (
  token: MintableErc20,
  deployer: Signer,
  vaultOfRewards: Signer,
  restWallets: Signer[]
) => {
  const stakedToken = token.address;
  const rewardsToken = token.address;
  const emissionManager = await deployer.getAddress();
  const vaultOfRewardsAddress = await vaultOfRewards.getAddress();

  const { StakedOasProxy } = await testDeployStakedOasV1(
    token,
    deployer,
    vaultOfRewards,
    restWallets
  );

  const StakedOasImpl = await deployStakedTokenV2Revision4([
    stakedToken,
    rewardsToken,
    COOLDOWN_SECONDS,
    UNSTAKE_WINDOW,
    vaultOfRewardsAddress,
    emissionManager,
    (1000 * 60 * 60).toString(),
    'Staked OAS',
    'sOAS',
    '18',
    ZERO_ADDRESS,
  ]);

  const StakedOasEncodedInitialize = StakedOasImpl.interface.encodeFunctionData('initialize');

  await StakedOasProxy.connect(restWallets[0]).upgradeToAndCall(
    StakedOasImpl.address,
    StakedOasEncodedInitialize
  );

  await insertContractAddressInDb(eContractid.StakedOasV2, StakedOasProxy.address);

  return {
    StakedOasProxy,
  };
};
