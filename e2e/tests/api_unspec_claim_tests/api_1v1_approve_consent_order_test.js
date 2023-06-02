/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;
const genAppType = 'STAY_THE_CLAIM';
Feature('GA 1v1 Caseworker Approve Consent Order API tests');

Scenario('caseworker makes decision 1V1 - CONSENT ORDER @api-testssss @api-scheduler-test', async ({api}) => {
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

  await api.judgeRevisitConsentScheduler(gaCaseReference, 'ORDER_MADE', genAppType);
  console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');
});

Scenario('Judge Revisit 1V1 - consentOrder End Date Scheduler @api-testssss @api-scheduler-test', async ({api}) => {

  console.log('*** Triggering Judge Revisit Order Made Scheduler ***');
  await api.judgeRevisitConsentScheduler(gaCaseReference, 'ORDER_MADE', genAppType);
  console.log('*** End of Judge Revisit Order Made Scheduler ***');

});

Scenario('Judge makes decision 1V1 - CONSENT ORDER - Uncloak Application', async ({api}) => {

  console.log('Make a General Application for Consent order');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.applicantSolicitorUser, civilCaseReference, false, false);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');


});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

