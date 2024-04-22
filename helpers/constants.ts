import { eOasysNetwork, eEthereumNetwork, tEthereumAddress } from './types';
import { getParamPerNetwork } from './misc-utils';
export const PERMISSIONED_CONTRACT_FACTORY_ADDRESS = '0x123e3ae459a8D049F27Ba62B8a5D48c68A100EBC';

export const MAX_UINT_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export const MOCK_ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export const WAD = Math.pow(10, 18).toString();
export const COOLDOWN_SECONDS = '3600'; // 1 hour in seconds
export const UNSTAKE_WINDOW = '1800'; // 30 min in seconds
export const DISTRIBUTION_DURATION = '86400'; // 1 day in seconds

export const STAKED_TOKEN_NAME = 'Staked OAS';
export const STAKED_TOKEN_SYMBOL = 'sOAS';
export const STAKED_TOKEN_DECIMALS = 18;

export const GOVERNANCE_V2 = '0xEC568fffba86c094cf06b22134B23074DFE2252c';
export const UPGRADABLE_CRP_FACTORY = '0x1156C30b08DbF16281c803EAe0d52Eee7652f10C';
export const WOAS_TOKEN = '0x5200000000000000000000000000000000000001';
export const BPOOL_FACTORY = '0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd';

export const CRP_IMPLEMENTATION = '0xadc74a134082ea85105258407159fbb428a73782';
export const SHORT_EXECUTOR = '0xee56e2b3d491590b5b31738cc34d5232f378a8d5';
export const LONG_EXECUTOR = '0x61910EcD7e8e942136CE7Fe7943f956cea1CC2f7';
export const ZERO_ADDRESS: tEthereumAddress = '0x0000000000000000000000000000000000000000';

// PEI constants
export const PSM_STAKER_PREMIUM = '2';

// just junk mock

export const RANDOM_ADDRESSES = [
  '0x0000000000000000000000000000000000000221',
  '0x0000000000000000000000000000000000000321',
  '0x0000000000000000000000000000000000000211',
  '0x0000000000000000000000000000000000000251',
  '0x0000000000000000000000000000000000000271',
  '0x0000000000000000000000000000000000000291',
  '0x0000000000000000000000000000000000000321',
  '0x0000000000000000000000000000000000000421',
  '0x0000000000000000000000000000000000000521',
  '0x0000000000000000000000000000000000000621',
  '0x0000000000000000000000000000000000000721',
];

// WOASToken
export const getTokenPerNetwork = (network: eEthereumNetwork | eOasysNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.coverage]: ZERO_ADDRESS,
      [eEthereumNetwork.hardhat]: '0x75AC15EbCA4e93D61bCc878ded9Ba338FD23E761',
      [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
      [eEthereumNetwork.kovan]: '0x75AC15EbCA4e93D61bCc878ded9Ba338FD23E761', // Mock WOAS Token
      [eEthereumNetwork.main]: '0x9c0435779F5E52CEC404D957C9bAa6f7d674C8bA',
      [eOasysNetwork.oasys]: WOAS_TOKEN,
      [eOasysNetwork.testnet]: WOAS_TOKEN,
    },
    network
  );

export const getCooldownSecondsPerNetwork = (
  network: eEthereumNetwork | eOasysNetwork
): tEthereumAddress =>
  getParamPerNetwork<string>(
    {
      [eEthereumNetwork.coverage]: COOLDOWN_SECONDS,
      [eEthereumNetwork.hardhat]: COOLDOWN_SECONDS,
      [eEthereumNetwork.rinkeby]: COOLDOWN_SECONDS,
      [eEthereumNetwork.kovan]: COOLDOWN_SECONDS, // '21600', // 8h
      [eEthereumNetwork.main]: '864000', // 10d
      [eOasysNetwork.oasys]: '864000', // Dummy
      [eOasysNetwork.testnet]: COOLDOWN_SECONDS, // Dummy
    },
    network
  );

export const getUnstakeWindowPerNetwork = (
  network: eEthereumNetwork | eOasysNetwork
): tEthereumAddress =>
  getParamPerNetwork<string>(
    {
      [eEthereumNetwork.coverage]: UNSTAKE_WINDOW,
      [eEthereumNetwork.hardhat]: UNSTAKE_WINDOW,
      [eEthereumNetwork.rinkeby]: UNSTAKE_WINDOW,
      [eEthereumNetwork.kovan]: UNSTAKE_WINDOW, // '10800', // 4h
      [eEthereumNetwork.main]: '172800', // 2d
      [eOasysNetwork.oasys]: '172800', // 2d
      [eOasysNetwork.testnet]: UNSTAKE_WINDOW, // Dummy
    },
    network
  );

// ProtoGovernance
export const getAdminPerNetwork = (network: eEthereumNetwork | eOasysNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.coverage]: ZERO_ADDRESS,
      [eEthereumNetwork.hardhat]: '0xc783df8a850f42e7F7e57013759C285caa701eB6',
      [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
      [eEthereumNetwork.kovan]: ZERO_ADDRESS,
      [eEthereumNetwork.main]: ZERO_ADDRESS,
      [eOasysNetwork.oasys]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773', // Initial admin
      [eOasysNetwork.testnet]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773', // Initial admin
    },
    network
  );

export const getDistributionDurationPerNetwork = (
  network: eEthereumNetwork | eOasysNetwork
): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.coverage]: DISTRIBUTION_DURATION,
      [eEthereumNetwork.hardhat]: '864000',
      [eEthereumNetwork.rinkeby]: DISTRIBUTION_DURATION,
      [eEthereumNetwork.kovan]: '864000',
      [eEthereumNetwork.main]: '12960000', // 5 months (30 days) in seconds
      [eOasysNetwork.oasys]: '12960000', // Dummy
      [eOasysNetwork.testnet]: DISTRIBUTION_DURATION, // Dummy
    },
    network
  );

// IncentivesVault proxy
// refs
// - https://github.com/aave/genesis-migration
// - https://github.com/aave/genesis-migration/blob/master/tasks/deployments/1.vault.ts
export const getIncentivesVaultPerNetwork = (
  network: eEthereumNetwork | eOasysNetwork
): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.coverage]: '',
      [eEthereumNetwork.hardhat]: '0x175d905470e85279899C37F89000b195f3d0c0C5',
      [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
      [eEthereumNetwork.kovan]: '0x175d905470e85279899C37F89000b195f3d0c0C5',
      [eEthereumNetwork.main]: '0x253f7b06c1d60c1fbbc9d82c301327eb86e3ba81',
      [eOasysNetwork.oasys]: '0x20d9B9D7D20CafD3FeAB504A2BC39592a860C00d',
      [eOasysNetwork.testnet]: '0xaf15E4465402592b48E75D1f9984ec2789ddfa97',
    },
    network
  );
