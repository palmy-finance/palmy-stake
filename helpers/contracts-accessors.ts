import { StakedTokenV2Rev4 } from './../types/StakedTokenV2Rev4.d';
import {
  deployContract,
  getContractFactory,
  getContract,
  getDeploymentCallData,
  getEthersSigners,
  registerContractAddressInJsonDb,
} from './contracts-helpers';
import { eContractid, eEthereumNetwork, eOasysNetwork, tEthereumAddress } from './types';
import { MintableErc20 } from '../types/MintableErc20';
import { StakedOas } from '../types/StakedOas';
import { StakedOasV2 } from '../types/StakedOasV2';
import { IcrpFactory } from '../types/IcrpFactory'; // Configurable right pool factory
import { IConfigurableRightsPool } from '../types/IConfigurableRightsPool';
import { IControllerPalmyEcosystemReserve } from '../types/IControllerPalmyEcosystemReserve';
import { SelfdestructTransfer } from '../types/SelfdestructTransfer';
import { IbPool } from '../types/IbPool'; // Balance pool
import { StakedTokenV2 } from '../types/StakedTokenV2';
import { StakedTokenV3 } from '../types/StakedTokenV3';
import { Ierc20Detailed } from '../types/Ierc20Detailed';
import { InitializableAdminUpgradeabilityProxy } from '../types/InitializableAdminUpgradeabilityProxy';
import { IncentivesController } from '../types/IncentivesController';
import { MockTransferHook } from '../types/MockTransferHook';
import { verifyContract } from './etherscan-verification';
import { ATokenMock } from '../types/ATokenMock';
import { getDb, DRE } from './misc-utils';
import { DoubleTransferHelper } from '../types/DoubleTransferHelper';
import {
  STAKED_TOKEN_DECIMALS,
  STAKED_TOKEN_NAME,
  STAKED_TOKEN_SYMBOL,
  ZERO_ADDRESS,
  getAdminPerNetwork,
  getCooldownSecondsPerNetwork,
  getDistributionDurationPerNetwork,
  getUnstakeWindowPerNetwork,
} from './constants';
import { Signer } from 'ethers';
import { StakedTokenBptRev2, StakedTokenV2Rev3 } from '../types';

export const deploy = async (id: eContractid, network: string) => {
  const path = require('path');
  const fs = require('fs');
  const dir = path.join(__dirname, '..', '.deployments', 'calldata', network);
  const file = path.join(dir, `${id}.calldata`);
  if (!fs.existsSync(file)) {
    throw new Error(`File ${file} not found`);
  }
  const calldata = fs.readFileSync(file, 'utf8');
  const signer = (await getEthersSigners())[0];
  const tx = await signer.sendTransaction({
    data: calldata,
    to: undefined,
    type: 2,
  });
  const receipt = await tx.wait();
  await registerContractAddressInJsonDb(id, receipt.contractAddress!, receipt.from);
  console.log(
    `\t ${id} deployed tx: ${receipt.transactionHash}, address: ${receipt.contractAddress}`
  );
  return receipt;
};

interface DbEntry {
  [network: string]: {
    deployer: string;
    address: string;
  };
}

export const printContracts = () => {
  const network = DRE.network.name;
  const db = getDb();
  console.log('Contracts deployed at', network);
  console.log('---------------------------------');

  const entries = Object.entries<DbEntry>(db.getState()).filter(([_k, value]) => !!value[network]);

  const contractsPrint = entries.map(
    ([key, value]: [string, DbEntry]) => `${key}: ${value[network].address}`
  );

  console.log('N# Contracts:', entries.length);
  console.log(contractsPrint.join('\n'), '\n');
};

export const deployStakedOas = async (
  [cooldownSeconds, unstakeWindow, emissionManager, distributionDuration]: [
    string,
    string,
    tEthereumAddress,
    string
  ],
  verify?: boolean
) => {
  const id = eContractid.StakedOas;
  const args: string[] = [cooldownSeconds, unstakeWindow, emissionManager, distributionDuration];
  const instance = await deployContract<StakedOas>(id, args);
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};
export const exportStakedOasDeploymentCallData = async () => {
  const id = eContractid.StakedOas;
  return await getDeploymentCallData(
    id,
    await getDeployArgs(DRE.network.name as eEthereumNetwork | eOasysNetwork, id)
  );
};

export const getDeployArgs = async (network: eEthereumNetwork | eOasysNetwork, id: eContractid) => {
  switch (id) {
    case eContractid.StakedOas:
      return [
        getCooldownSecondsPerNetwork(network),
        getUnstakeWindowPerNetwork(network),
        await getAdminPerNetwork(network),
        getDistributionDurationPerNetwork(network),
      ];
    case eContractid.StakedTokenV2Rev4:
      return [
        getCooldownSecondsPerNetwork(network),
        getUnstakeWindowPerNetwork(network),
        await getAdminPerNetwork(network),
        getDistributionDurationPerNetwork(network),
        STAKED_TOKEN_NAME,
        STAKED_TOKEN_SYMBOL,
        `${STAKED_TOKEN_DECIMALS}`,
        ZERO_ADDRESS,
      ];
    default:
      return [];
  }
};

export const deployStakedOasV2 = async (
  [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
  ]: [
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    tEthereumAddress,
    tEthereumAddress,
    string
  ],
  verify?: boolean
) => {
  const id = eContractid.StakedOasV2;
  const args: string[] = [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
    ZERO_ADDRESS, // gov address
  ];
  const instance = await deployContract<StakedOasV2>(id, args);
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const deployStakedTokenV2 = async (
  [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ]: [
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    string,
    string,
    tEthereumAddress
  ],
  verify?: boolean,
  signer?: Signer
) => {
  const id = eContractid.StakedTokenV2;
  const args: string[] = [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ];
  const instance = await deployContract<StakedTokenV2>(id, args, '', signer);
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const deployStakedTokenV2Revision4 = async (
  [
    cooldownSeconds,
    unstakeWindow,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ]: [string, string, tEthereumAddress, string, string, string, string, tEthereumAddress],
  verify?: boolean,
  signer?: Signer
) => {
  const id = eContractid.StakedTokenV2Rev4;
  const args: string[] = [
    cooldownSeconds,
    unstakeWindow,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ];
  const instance = await deployContract<StakedTokenV2Rev4>(id, args, '', signer);
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const exportStakedTokenV2Rev4DeploymentCallData = async () => {
  const id = eContractid.StakedTokenV2Rev4;
  return await getDeploymentCallData(
    id,
    await getDeployArgs(DRE.network.name as eEthereumNetwork | eOasysNetwork, id)
  );
};

export const deployStakedTokenV2Revision3 = async (
  [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ]: [
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    string,
    string,
    tEthereumAddress
  ],
  verify?: boolean,
  signer?: Signer
) => {
  const id = eContractid.StakedTokenV2Rev3;
  const args: string[] = [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ];
  const instance = await deployContract<StakedTokenV2Rev3>(id, args, '', signer);
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const deployStakedTokenBptRevision2 = async (
  [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ]: [
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    string,
    string,
    tEthereumAddress
  ],
  verify?: boolean,
  signer?: Signer
) => {
  const id = eContractid.StakedTokenBptRev2;
  const args: string[] = [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ];
  const instance = await deployContract<StakedTokenBptRev2>(id, args, '', signer);
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const deployStakedTokenV3 = async (
  [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ]: [
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    string,
    string,
    tEthereumAddress
  ],
  verify?: boolean,
  signer?: Signer
) => {
  const id = eContractid.StakedTokenV3;
  const args: string[] = [
    stakedToken,
    rewardsToken,
    cooldownSeconds,
    unstakeWindow,
    rewardsVault,
    emissionManager,
    distributionDuration,
    name,
    symbol,
    decimals,
    governance,
  ];
  const instance = await deployContract<StakedTokenV3>(id, args, '', signer);
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const deployIncentivesController = async (
  [rewardToken, rewardsVault, psm, extraPsmReward, emissionManager, distributionDuration]: [
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    string,
    tEthereumAddress,
    string
  ],
  verify?: boolean
) => {
  const id = eContractid.IncentivesController;
  const args: string[] = [
    rewardToken,
    rewardsVault,
    psm,
    extraPsmReward,
    emissionManager,
    distributionDuration,
  ];
  const instance = await deployContract<IncentivesController>(id, args);
  await instance.deployTransaction.wait();
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const deployMintableErc20 = async ([name, symbol, decimals]: [string, string, number]) =>
  await deployContract<MintableErc20>(eContractid.MintableErc20, [name, symbol, decimals]);

export const deployInitializableAdminUpgradeabilityProxy = async (
  verify?: boolean,
  signer?: Signer
) => {
  const id = eContractid.InitializableAdminUpgradeabilityProxy;
  const args: string[] = [];
  const instance = await deployContract<InitializableAdminUpgradeabilityProxy>(
    id,
    args,
    '',
    signer
  );
  await instance.deployTransaction.wait();
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};
export const exportInitializableAdminUpgradeabilityProxyDeploymentCallData = async () => {
  const id = eContractid.InitializableAdminUpgradeabilityProxy;
  return await getDeploymentCallData(id, []);
};

export const deployMockTransferHook = async () =>
  await deployContract<MockTransferHook>(eContractid.MockTransferHook, []);

export const deployATokenMock = async (aicAddress: tEthereumAddress, slug: string) =>
  await deployContract<ATokenMock>(eContractid.ATokenMock, [aicAddress], slug);

export const deployDoubleTransferHelper = async (token: tEthereumAddress, verify?: boolean) => {
  const id = eContractid.DoubleTransferHelper;
  const args = [token];
  const instance = await deployContract<DoubleTransferHelper>(id, args);
  await instance.deployTransaction.wait();
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const getMintableErc20 = getContractFactory<MintableErc20>(eContractid.MintableErc20);

export const getStakedOas = getContractFactory<StakedOas>(eContractid.StakedOas);
export const getStakedOasV2 = getContractFactory<StakedOasV2>(eContractid.StakedOasV2);

export const getStakedOasProxy = async (address?: tEthereumAddress) => {
  return await getContract<InitializableAdminUpgradeabilityProxy>(
    eContractid.InitializableAdminUpgradeabilityProxy,
    address || (await getDb().get(`${eContractid.StakedOas}.${DRE.network.name}`).value()).address
  );
};

export const getStakedOasImpl = async (address?: tEthereumAddress) => {
  return await getContract<StakedOas>(
    eContractid.StakedOas,
    address ||
      (
        await getDb().get(`${eContractid.StakedOasImpl}.${DRE.network.name}`).value()
      ).address
  );
};

export const getStakedTokenV2 = async (address?: tEthereumAddress) => {
  return await getContract<StakedTokenV2>(
    eContractid.StakedTokenV2,
    address ||
      (
        await getDb().get(`${eContractid.StakedTokenV2}.${DRE.network.name}`).value()
      ).address
  );
};
export const getStakedTokenV3 = async (address?: tEthereumAddress) => {
  return await getContract<StakedTokenV3>(
    eContractid.StakedTokenV2,
    address ||
      (
        await getDb().get(`${eContractid.StakedTokenV2}.${DRE.network.name}`).value()
      ).address
  );
};

export const getStakedTokenV2Rev3 = async (address?: tEthereumAddress) => {
  return await getContract<StakedTokenV2Rev3>(
    eContractid.StakedTokenV2Rev3,
    address ||
      (
        await getDb().get(`${eContractid.StakedTokenV2Rev3}.${DRE.network.name}`).value()
      ).address
  );
};

export const getStakedTokenV2Rev4 = async (address?: tEthereumAddress) => {
  return await getContract<StakedTokenV2Rev3>(
    eContractid.StakedTokenV2Rev4,
    address ||
      (
        await getDb().get(`${eContractid.StakedTokenV2Rev4}.${DRE.network.name}`).value()
      ).address
  );
};

export const getIncentivesController = getContractFactory<IncentivesController>(
  eContractid.IncentivesController
);

export const getIErc20Detailed = getContractFactory<Ierc20Detailed>(eContractid.IERC20Detailed);

export const getATokenMock = getContractFactory<ATokenMock>(eContractid.ATokenMock);

export const getCRPFactoryContract = (address: tEthereumAddress) =>
  getContract<IcrpFactory>(eContractid.ICRPFactory, address);

export const getCRPContract = (address: tEthereumAddress) =>
  getContract<IConfigurableRightsPool>(eContractid.IConfigurableRightsPool, address);

export const getBpool = (address: tEthereumAddress) =>
  getContract<IbPool>(eContractid.IBPool, address);

export const getERC20Contract = (address: tEthereumAddress) =>
  getContract<MintableErc20>(eContractid.MintableErc20, address);

export const getController = (address: tEthereumAddress) =>
  getContract<IControllerPalmyEcosystemReserve>(
    eContractid.IControllerPalmyEcosystemReserve,
    address
  );

export const deploySelfDestruct = async () => {
  const id = eContractid.MockSelfDestruct;
  const instance = await deployContract<SelfdestructTransfer>(id, []);
  await instance.deployTransaction.wait();
  return instance;
};
