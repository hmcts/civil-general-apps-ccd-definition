/* eslint-disable no-unused-vars */
const config = require('../../config.js');
let civilCaseReference, gaCaseReference;
const mpScenario = 'ONE_V_ONE';
const claimAmountJudge = '11000';
const errorMsg = 'Sorry this service is not available in the current case management location, please raise an application manually.';

Feature('General Application Smoke tests @ga-smoke-tests');

Scenario('GA 1v1  - Judge Makes Decision Order Made @smoke-tests', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', claimAmountJudge);
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.defendantSolicitorUser, civilCaseReference);
  console.log('Without Notice General Application Initiated by Defendant2 : ' + gaCaseReference);
  console.log('*** Start Judge makes decision order made: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMade(config.judgeUser2WithRegionId2, gaCaseReference);
  }else {
    await api.judgeMakesDecisionOrderMade(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes decision order made - GA Case Reference: ' + gaCaseReference + ' ***');

  await I.login(config.defendantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see('Order Made');
});

//this test will be removed after we do national rollout
Scenario('Non EA Region Cases should not have access to the GA Feature @smoke-tests', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', '11000');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  if(['aat'].includes(config.runningEnv)) {
    await I.verifyGAAccessToNonEARegion(errorMsg);
  }
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
