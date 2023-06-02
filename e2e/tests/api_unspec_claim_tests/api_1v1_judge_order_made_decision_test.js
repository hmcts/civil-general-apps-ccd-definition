/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const genAppType = 'STAY_THE_CLAIM';

let civilCaseReference, gaCaseReference, state;

Feature('GA 1v1 Judge make decision order made API tests');

Scenario('Judge makes decision 1V1 - Order Made  @api-tests @api-scheduler-test', async ({api}) => {

  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithStayClaim(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge makes decision order made and : ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    state = await api.judgeMakesDecisionOrderMadeStayClaimAppln(config.judgeUser, gaCaseReference);
  } else {
    state = await api.judgeMakesDecisionOrderMadeStayClaimAppln(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes decision order made - GA Case Reference: ' + gaCaseReference + ' ***');
});

Scenario('Judge Revisit 1V1 - Order Made End Date Scheduler @api-scheduler-test', async ({api}) => {

  console.log('*** Triggering Judge Revisit Order Made Scheduler ***');
  await api.judgeRevisitScheduler(gaCaseReference, state, genAppType);
  console.log('*** End of Judge Revisit Order Made Scheduler ***');

});

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

  await api.judgeRevisitConsentScheduler(gaCaseReference, 'ORDER_MADE', genAppType);
  console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
