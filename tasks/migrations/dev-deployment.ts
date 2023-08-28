import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { StakedOasysLend } from '../../types/StakedOasysLend';

task('dev-deployment', 'Deployment in hardhat').setAction(async (_, localBRE) => {
  const DRE: HardhatRuntimeEnvironment = await localBRE.run('set-dre');

  const StakedOasysLend = (await DRE.run(
    `deploy-${eContractid.StakedOasysLend}`
  )) as StakedOasysLend;
});
