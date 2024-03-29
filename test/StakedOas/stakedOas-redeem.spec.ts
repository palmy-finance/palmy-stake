import { makeSuite, TestEnv } from '../helpers/make-suite';
import { COOLDOWN_SECONDS, UNSTAKE_WINDOW } from '../../helpers/constants';
import {
  waitForTx,
  advanceBlock,
  timeLatest,
  increaseTime,
  increaseTimeAndMine,
} from '../../helpers/misc-utils';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

const { expect } = require('chai');

makeSuite('StakedToken. Redeem', (testEnv: TestEnv) => {
  it('Reverts trying to redeem 0 amount', async () => {
    const { stakedToken, users } = testEnv;

    const amount = '0';
    const staker = users[1];

    await expect(
      stakedToken.connect(staker.signer).redeem(staker.address, amount)
    ).to.be.revertedWith('INVALID_ZERO_AMOUNT');
  });

  it('User 1 stakes 50 Token', async () => {
    const { stakedToken, woasToken, users } = testEnv;
    const amount = ethers.utils.parseEther('50');
    const staker = users[1];

    await waitForTx(await woasToken.connect(staker.signer).approve(stakedToken.address, amount));
    await waitForTx(await stakedToken.connect(staker.signer).stake(staker.address, amount));
  });

  it('User 1 tries to redeem without activating the cooldown first', async () => {
    const { stakedToken, users } = testEnv;
    const amount = ethers.utils.parseEther('50');
    const staker = users[1];

    await expect(
      stakedToken.connect(staker.signer).redeem(staker.address, amount)
    ).to.be.revertedWith('UNSTAKE_WINDOW_FINISHED');
  });

  it('User 1 activates the cooldown, but is not able to redeem before the COOLDOWN_SECONDS passed', async () => {
    const { stakedToken, users } = testEnv;
    const amount = ethers.utils.parseEther('50');
    const staker = users[1];

    await stakedToken.connect(staker.signer).cooldown();

    const startedCooldownAt = new BigNumber(
      await (await stakedToken.stakersCooldowns(staker.address)).toString()
    );
    const currentTime = await timeLatest();

    const remainingCooldown = startedCooldownAt.plus(COOLDOWN_SECONDS).minus(currentTime);
    await increaseTimeAndMine(Number(remainingCooldown.dividedBy('2').toString()));
    await expect(
      stakedToken.connect(staker.signer).redeem(staker.address, amount)
    ).to.be.revertedWith('INSUFFICIENT_COOLDOWN');

    await advanceBlock(startedCooldownAt.plus(new BigNumber(COOLDOWN_SECONDS).minus(1)).toNumber()); // We fast-forward time to just before COOLDOWN_SECONDS

    await expect(
      stakedToken.connect(staker.signer).redeem(staker.address, amount)
    ).to.be.revertedWith('INSUFFICIENT_COOLDOWN');

    await advanceBlock(
      startedCooldownAt
        .plus(new BigNumber(COOLDOWN_SECONDS).plus(UNSTAKE_WINDOW).plus(1))
        .toNumber()
    ); // We fast-forward time to just after the unstake window

    await expect(
      stakedToken.connect(staker.signer).redeem(staker.address, amount)
    ).to.be.revertedWith('UNSTAKE_WINDOW_FINISHED');
  });

  it('User 1 activates the cooldown again, and tries to redeem a bigger amount that he has staked, receiving the balance', async () => {
    const { stakedToken, woasToken, users } = testEnv;
    const amount = ethers.utils.parseEther('1000');
    const staker = users[1];

    await stakedToken.connect(staker.signer).cooldown();
    const startedCooldownAt = new BigNumber(
      await (await stakedToken.stakersCooldowns(staker.address)).toString()
    );
    const currentTime = await timeLatest();

    const remainingCooldown = startedCooldownAt.plus(COOLDOWN_SECONDS).minus(currentTime);

    await increaseTimeAndMine(remainingCooldown.plus(1).toNumber());
    const tokenBalanceBefore = new BigNumber(
      (await woasToken.balanceOf(staker.address)).toString()
    );
    const stakedTokenBalanceBefore = (await stakedToken.balanceOf(staker.address)).toString();
    await stakedToken.connect(staker.signer).redeem(staker.address, amount);
    const tokenBalanceAfter = new BigNumber((await woasToken.balanceOf(staker.address)).toString());
    const stakedTokenBalanceAfter = (await stakedToken.balanceOf(staker.address)).toString();
    expect(tokenBalanceAfter.minus(stakedTokenBalanceBefore).toString()).to.be.equal(
      tokenBalanceBefore.toString()
    );
    expect(stakedTokenBalanceAfter).to.be.equal('0');
  });

  it('User 1 activates the cooldown again, and redeems within the unstake period', async () => {
    const { stakedToken, woasToken, users } = testEnv;
    const amount = ethers.utils.parseEther('50');
    const staker = users[1];

    await waitForTx(await woasToken.connect(staker.signer).approve(stakedToken.address, amount));
    await waitForTx(await stakedToken.connect(staker.signer).stake(staker.address, amount));

    await stakedToken.connect(staker.signer).cooldown();
    const startedCooldownAt = new BigNumber(
      await (await stakedToken.stakersCooldowns(staker.address)).toString()
    );
    const currentTime = await timeLatest();

    const remainingCooldown = startedCooldownAt.plus(COOLDOWN_SECONDS).minus(currentTime);

    await increaseTimeAndMine(remainingCooldown.plus(1).toNumber());
    const tokenBalanceBefore = new BigNumber(
      (await woasToken.balanceOf(staker.address)).toString()
    );
    await stakedToken.connect(staker.signer).redeem(staker.address, amount);
    const tokenBalanceAfter = new BigNumber((await woasToken.balanceOf(staker.address)).toString());
    expect(tokenBalanceAfter.minus(amount.toString()).toString()).to.be.equal(
      tokenBalanceBefore.toString()
    );
  });

  it('User 4 stakes 50 Token, activates the cooldown and redeems half of the amount', async () => {
    const { stakedToken, woasToken, users } = testEnv;
    const amount = ethers.utils.parseEther('50');
    const staker = users[5];

    await waitForTx(await woasToken.connect(staker.signer).approve(stakedToken.address, amount));
    await waitForTx(await stakedToken.connect(staker.signer).stake(staker.address, amount));

    await stakedToken.connect(staker.signer).cooldown();

    const cooldownActivationTimestamp = await timeLatest();

    await advanceBlock(
      cooldownActivationTimestamp.plus(new BigNumber(COOLDOWN_SECONDS).plus(1)).toNumber()
    );

    const tokenBalanceBefore = new BigNumber(
      (await woasToken.balanceOf(staker.address)).toString()
    );
    await stakedToken
      .connect(staker.signer)
      .redeem(staker.address, ethers.utils.parseEther('50').div(2));
    const tokenBalanceAfter = new BigNumber((await woasToken.balanceOf(staker.address)).toString());
    expect(tokenBalanceAfter.minus(amount.toString()).toString()).to.be.equal(
      tokenBalanceBefore.div(2).toFixed()
    );
  });

  it('User 5 stakes 50 Token, activates the cooldown and redeems with rewards not enabled', async () => {
    const { stakedToken, woasToken, users } = testEnv;
    const amount = ethers.utils.parseEther('50');
    const staker = users[5];

    await waitForTx(await woasToken.connect(staker.signer).approve(stakedToken.address, amount));
    await waitForTx(await stakedToken.connect(staker.signer).stake(staker.address, amount));

    await stakedToken.connect(staker.signer).cooldown();

    const cooldownActivationTimestamp = await timeLatest();

    await advanceBlock(
      cooldownActivationTimestamp.plus(new BigNumber(COOLDOWN_SECONDS).plus(1)).toNumber()
    );

    const tokenBalanceBefore = new BigNumber(
      (await woasToken.balanceOf(staker.address)).toString()
    );
    await stakedToken.connect(staker.signer).redeem(staker.address, amount);
    const tokenBalanceAfter = new BigNumber((await woasToken.balanceOf(staker.address)).toString());
    expect(tokenBalanceAfter.minus(amount.toString()).toString()).to.be.equal(
      tokenBalanceBefore.toString()
    );
  });
});
