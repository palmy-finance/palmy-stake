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
  deployStakedOasysLend,
  deployMockTransferHook,
  deployStakedOasysLendV2,
  deployStakedTokenV2Revision3,
  deployStakedTokenV2Revision4,
} from '../../helpers/contracts-accessors';
import { insertContractAddressInDb } from '../../helpers/contracts-helpers';
import { waitForTx } from '../../helpers/misc-utils';
import { eContractid } from '../../helpers/types';
import { MintableErc20 } from '../../types/MintableErc20';

export const testDeployStakedRayV1 = async (
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
  const StakedOasysLendProxy = await deployInitializableAdminUpgradeabilityProxy();

  const incentivesControllerImplementation = await deployIncentivesController([
    token.address,
    vaultOfRewardsAddress,
    StakedOasysLendProxy.address,
    PSM_STAKER_PREMIUM,
    emissionManager,
    (1000 * 60 * 60).toString(),
  ]);

  const StakedOasysLendImpl = await deployStakedOasysLend([
    stakedToken,
    rewardsToken,
    COOLDOWN_SECONDS,
    UNSTAKE_WINDOW,
    vaultOfRewardsAddress,
    emissionManager,
    (1000 * 60 * 60).toString(),
  ]);

  const mockTransferHook = await deployMockTransferHook();

  const StakedOasysLendEncodedInitialize = StakedOasysLendImpl.interface.encodeFunctionData(
    'initialize',
    [mockTransferHook.address, STAKED_TOKEN_NAME, STAKED_TOKEN_SYMBOL, STAKED_TOKEN_DECIMALS]
  );
  await StakedOasysLendProxy['initialize(address,address,bytes)'](
    StakedOasysLendImpl.address,
    proxyAdmin,
    StakedOasysLendEncodedInitialize
  );
  await waitForTx(
    await token.connect(vaultOfRewards).approve(StakedOasysLendProxy.address, MAX_UINT_AMOUNT)
  );
  await insertContractAddressInDb(eContractid.StakedOasysLend, StakedOasysLendProxy.address);

  const peiEncodedInitialize = incentivesControllerImplementation.interface.encodeFunctionData(
    'initialize'
  );
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
    StakedOasysLendProxy,
  };
};

export const testDeployStakedRayV2 = async (
  token: MintableErc20,
  deployer: Signer,
  vaultOfRewards: Signer,
  restWallets: Signer[]
) => {
  const stakedToken = token.address;
  const rewardsToken = token.address;
  const emissionManager = await deployer.getAddress();
  const vaultOfRewardsAddress = await vaultOfRewards.getAddress();

  const { StakedOasysLendProxy } = await testDeployStakedRayV1(
    token,
    deployer,
    vaultOfRewards,
    restWallets
  );

  const StakedOasysLendImpl = await deployStakedTokenV2Revision4([
    stakedToken,
    rewardsToken,
    COOLDOWN_SECONDS,
    UNSTAKE_WINDOW,
    vaultOfRewardsAddress,
    emissionManager,
    (1000 * 60 * 60).toString(),
    'Staked OAL',
    'sOAL',
    '18',
    ZERO_ADDRESS,
  ]);

  const StakedOasysLendEncodedInitialize = StakedOasysLendImpl.interface.encodeFunctionData(
    'initialize'
  );

  await StakedOasysLendProxy.connect(restWallets[0]).upgradeToAndCall(
    StakedOasysLendImpl.address,
    StakedOasysLendEncodedInitialize
  );

  await insertContractAddressInDb(eContractid.StakedOasysLendV2, StakedOasysLendProxy.address);

  return {
    StakedOasysLendProxy,
  };
};