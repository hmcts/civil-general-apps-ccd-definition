/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const states = require('../../../fixtures/ga-ccd/state');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
let civilCaseReference, gaCaseReference;

Feature('Before SDO 1v2 - GA - Consent Orders @ui-nightly @regression2');

Scenario.skip('NBC admin Approve Consent Order @e2e-tests', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.secondDefendantSolicitorUser,
    civilCaseReference, false, false);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentConsentResponse1v2(config.applicantSolicitorUser,
    config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('NBC admin Approves Consent order' + gaCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.nbcAdminWithRegionId4);
  } else {
    await I.login(config.nbcAdminWithRegionId4);
  }

  await I.approveConsentOrder(gaCaseReference);
  await I.verifyApplicationDocument('Consent Order');
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.ORDER_MADE.name);
  await I.verifyClaimDocument('Consent order document');
  await I.verifyCaseFileDocument('Consent Order');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
