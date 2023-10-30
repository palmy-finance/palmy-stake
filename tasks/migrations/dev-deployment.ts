import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { StakedPalmy } from '../../types/StakedPalmy';

task('dev-deployment', 'Deployment in hardhat').setAction(async (_, localBRE) => {
  const DRE: HardhatRuntimeEnvironment = await localBRE.run('set-dre');

  const StakedPalmy = (await DRE.run(`deploy-${eContractid.StakedPalmy}`)) as StakedPalmy;
});
