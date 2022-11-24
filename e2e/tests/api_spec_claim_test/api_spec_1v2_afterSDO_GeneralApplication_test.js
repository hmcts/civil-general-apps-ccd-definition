/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_SAME_SOL';

let civilCaseReference, gaCaseReference;

Feature('Spec 1v2 - General Application after SDO Journey @api-nightly');

Scenario.skip('Spec Claimant create GA - JUDICIAL_REFERRAL state', async ({api, I}) => {
  civilCaseReference = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseSpecClaim(config.defendantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO');
  await api.claimantResponseClaimSpec(config.applicantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO',
    'AWAITING_APPLICANT_INTENTION');
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge makes decision order made: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMade(config.judgeUserWithRegionId1, gaCaseReference);
  } else {
    await api.judgeMakesDecisionOrderMade(config.judgeUserWithRegionId1, gaCaseReference);
  }
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'ORDER_MADE');
});

Scenario.skip('Spec Claimant create GA - CASE_PROGRESSION state', async ({api_sdo, api, I}) => {
  civilCaseReference = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseSpecClaim(config.defendantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO');
  await api.claimantResponseClaimSpec(config.applicantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO',
    'AWAITING_APPLICANT_INTENTION');
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Create SDO');
  await api_sdo.createSDO(civilCaseReference, config.judgeUserWithRegionId1);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionWrittenRep(config.judgeUserWithRegionId1, gaCaseReference);
  }else {
    await api.judgeMakesDecisionWrittenRep(config.judgeUserWithRegionId1, gaCaseReference);
  }
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'AWAITING_WRITTEN_REPRESENTATIONS');
});

AfterSuite(async ({api}) => {
  // await api.cleanUp();
});
