import rawBRE from 'hardhat';
import { Signer, ethers } from 'ethers';
import { getEthersSigners } from '../helpers/contracts-helpers';
import { initializeMakeSuite } from './helpers/make-suite';
import { deployMintableErc20, deployATokenMock } from '../helpers/contracts-accessors';
import { waitForTx } from '../helpers/misc-utils';
import { MintableErc20 } from '../types/MintableErc20';
import { testDeployStakedRayV2, testDeployStakedRayV1 } from './helpers/deploy';
import { parseEther } from 'ethers/lib/utils';

const topUpWalletsWithOal = async (wallets: Signer[], plmyToken: MintableErc20, amount: string) => {
  for (const wallet of wallets) {
    await waitForTx(await plmyToken.connect(wallet).mint(amount));
  }
};

const buildTestEnv = async (deployer: Signer, vaultOfRewards: Signer, restWallets: Signer[]) => {
  console.time('setup');

  const plmyToken = await deployMintableErc20(['Palmy', 'OAL', 18]);

  await waitForTx(await plmyToken.connect(vaultOfRewards).mint(ethers.utils.parseEther('1000000')));
  await topUpWalletsWithOal(
    [
      restWallets[0],
      restWallets[1],
      restWallets[2],
      restWallets[3],
      restWallets[4],
      restWallets[5],
    ],
    plmyToken,
    ethers.utils.parseEther('100').toString()
  );

  await testDeployStakedRayV2(plmyToken, deployer, vaultOfRewards, restWallets);

  const { incentivesControllerProxy } = await testDeployStakedRayV1(
    plmyToken,
    deployer,
    vaultOfRewards,
    restWallets
  );

  await deployATokenMock(incentivesControllerProxy.address, 'lDai');
  await deployATokenMock(incentivesControllerProxy.address, 'lWeth');
  const toVaultAmount = parseEther('2000');
  await plmyToken.mint(toVaultAmount);
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
