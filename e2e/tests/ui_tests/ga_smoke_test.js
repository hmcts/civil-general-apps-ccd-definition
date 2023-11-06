/* eslint-disable no-unused-vars */
const config = require('../../config.js');
let civilCaseReference, gaCaseReference;

const mpScenario1v2 = 'ONE_V_TWO_TWO_LEGAL_REP';

Feature('General Application Smoke tests @ga-smoke-tests');

Scenario('GA 1v2  - Judge Makes Decision Order Made @smoke-tests', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario1v2, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario1v2, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.defendantSolicitorUser, civilCaseReference);
  console.log('Without Notice General Application Initiated by Defendant2 : ' + gaCaseReference);

  console.log('*** Start Judge makes decision order made: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMade(config.judgeUserWithRegionId1, gaCaseReference);
  }else {
    await api.judgeMakesDecisionOrderMade(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes decision order made - GA Case Reference: ' + gaCaseReference + ' ***');

  await I.login(config.defendantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see('Order Made');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
