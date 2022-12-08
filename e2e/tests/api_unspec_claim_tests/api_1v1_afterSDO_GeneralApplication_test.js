/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('Unspec 1v1 - General Application after SDO Journey @api-nightly');

// Test before enable this test
Scenario.skip('Claimant create GA - JUDICIAL_REFERRAL state', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'PROCEEDS_IN_HERITAGE_SYSTEM');
  // console.log('Civil Case created for general application: ' + civilCaseReference);
  //
  // console.log('Make a General Application');
  // gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  //
  // console.log('*** Start Judge makes decision order made: ' + gaCaseReference + ' ***');
  // if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
  //   await api.judgeMakesDecisionOrderMade(config.judgeUserWithRegionId1, gaCaseReference);
  // } else {
  //   await api.judgeMakesDecisionOrderMade(config.judgeUserWithRegionId1, gaCaseReference);
  // }
  // await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'ORDER_MADE');
});

Scenario.skip('Claimant create GA - CASE_PROGRESSION state', async ({api_sdo, api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'SoleTrader');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.claimantResponseClaim(config.applicantSolicitorUser, 'FULL_ADMISSION', 'ONE_V_TWO',
    'AWAITING_APPLICANT_INTENTION');
  await I.wait(10);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Create SDO');
  await api_sdo.createSDO(civilCaseReference, config.judgeUserWithRegionId1, 'CREATE_SMALL');
  await I.wait(10);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUserWithRegionId1, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeUserWithRegionId1, gaCaseReference);
  }
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'LISTING_FOR_A_HEARING');
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'LISTING_FOR_A_HEARING');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
