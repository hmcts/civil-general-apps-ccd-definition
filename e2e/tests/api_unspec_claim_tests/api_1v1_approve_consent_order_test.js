/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('GA 1v1 Caseworker Approve Consent Order API tests @api-tests');

Scenario('caseworker makes decision 1V1 - CONSENT ORDER', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.applicantSolicitorUser, civilCaseReference, false, false);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start CaseWorker Approve Consent Order on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.nbcAdminApproveConsentOrder(config.nbcAdminWithRegionId4, gaCaseReference);
  } else {
    await api.nbcAdminApproveConsentOrder(config.hearingCenterAdminLocal, gaCaseReference);
  }
  console.log('*** End CaseWorker Approve Consent Order on GA Case Reference: ' + gaCaseReference + ' ***');

});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

