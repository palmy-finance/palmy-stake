import { makeSuite, TestEnv } from '../helpers/make-suite';
import { MAX_UINT_AMOUNT } from '../../helpers/constants';

const { expect } = require('chai');

makeSuite('IncentivesController initialize', (testEnv: TestEnv) => {
  // TODO: useless or not?
  it('Tries to call initialize second time, should be reverted', async () => {
    const { incentivesController } = testEnv;
    await expect(incentivesController.initialize()).to.be.reverted;
  });
  it('allowance on oal token should be granted to psm contract for pei', async () => {
    const { incentivesController, stakedToken, oalToken } = testEnv;
    await expect(
      (await oalToken.allowance(incentivesController.address, stakedToken.address)).toString()
    ).to.be.equal(MAX_UINT_AMOUNT);
  });
});
