/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const genAppType = 'UNLESS_ORDER';

let civilCaseReference, gaCaseReference, state;

Feature('GA 1v1 Judge make decision unless order API tests');

Scenario('Judge makes decision 1V1 - unless order  @api-tests @api-scheduler-test @fail', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', '11000');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithUnlessOrder(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge makes decision unless order: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    state = await api.judgeMakesDecisionOrderMadeUnlessOrderAppln(config.judgeUser2WithRegionId2, gaCaseReference);
  } else {
    state = await api.judgeMakesDecisionOrderMadeUnlessOrderAppln(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes decision unless order - GA Case Reference: ' + gaCaseReference + ' ***');
});

Scenario('Judge Revisit 1V1 - unless order End Date Scheduler @api-scheduler-test @fail', async ({api}) => {

  console.log('*** Triggering Judge Revisit unless order Scheduler ***');
  await api.judgeRevisitScheduler(gaCaseReference, state, genAppType);
  console.log('*** End of Judge Revisit unless order Scheduler ***');

});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
