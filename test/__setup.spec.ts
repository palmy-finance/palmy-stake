import rawBRE from 'hardhat';
import { Signer, ethers } from 'ethers';
import { getEthersSigners } from '../helpers/contracts-helpers';
import { initializeMakeSuite } from './helpers/make-suite';
import { deployMintableErc20, deployATokenMock } from '../helpers/contracts-accessors';
import { waitForTx } from '../helpers/misc-utils';
import { MintableErc20 } from '../types/MintableErc20';
import {
  testDeployStakedOasV2 as testDeployStakedOasV2,
  testDeployStakedOasV1 as testDeployStakedOasV1,
} from './helpers/deploy';
import { parseEther } from 'ethers/lib/utils';

const topUpWalletsWithOas = async (wallets: Signer[], woasToken: MintableErc20, amount: string) => {
  for (const wallet of wallets) {
    await waitForTx(await woasToken.connect(wallet).mint(amount));
  }
};

const buildTestEnv = async (deployer: Signer, vaultOfRewards: Signer, restWallets: Signer[]) => {
  console.time('setup');

  const woasToken = await deployMintableErc20(['Palmy', 'WOAS', 18]);

  await waitForTx(await woasToken.connect(vaultOfRewards).mint(ethers.utils.parseEther('1000000')));
  await topUpWalletsWithOas(
    [
      restWallets[0],
      restWallets[1],
      restWallets[2],
      restWallets[3],
      restWallets[4],
      restWallets[5],
    ],
    woasToken,
    ethers.utils.parseEther('100').toString()
  );

  await testDeployStakedOasV2(woasToken, deployer, vaultOfRewards, restWallets);

  const { incentivesControllerProxy } = await testDeployStakedOasV1(
    woasToken,
    deployer,
    vaultOfRewards,
    restWallets
  );

  await deployATokenMock(incentivesControllerProxy.address, 'lDai');
  await deployATokenMock(incentivesControllerProxy.address, 'lWeth');
  const toVaultAmount = parseEther('2000');
  await woasToken.mint(toVaultAmount);
  console.timeEnd('setup');
};

before(async () => {
  await rawBRE.run('set-dre');
  const [deployer, rewardsVault, ...restWallets] = await getEthersSigners();
  console.log('-> Deploying test environment...');
  await buildTestEnv(deployer, rewardsVault, restWallets);
  await initializeMakeSuite();
  console.log('\n***************');
  console.log('Setup and snapshot finished');
  console.log('***************\n');
});
