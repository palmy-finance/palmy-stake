import { task } from 'hardhat/config';

import { eContractid } from '../../helpers/types';
import { saveDeploymentCallData } from '../../helpers/contracts-helpers';
import { exportStakedTokenV2Rev4DeploymentCallData } from '../../helpers/contracts-accessors';

const { StakedTokenV2Rev4 } = eContractid;

task(
  `export-deploy-calldata-${StakedTokenV2Rev4}`,
  `Export deployment calldata of the ${StakedTokenV2Rev4} contract`
).setAction(async ({}, localBRE) => {
  await localBRE.run('set-dre');

  console.log(`\n- ${StakedTokenV2Rev4} exporting...`);
  console.log(`\Exporting ${StakedTokenV2Rev4} calldata ...`);
  const stakedTokenV2Rev4 = await exportStakedTokenV2Rev4DeploymentCallData();
  await saveDeploymentCallData(StakedTokenV2Rev4, stakedTokenV2Rev4);

  console.log(`\tFinished ${StakedTokenV2Rev4} implementation exporting`);
});
