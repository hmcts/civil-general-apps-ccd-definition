/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const genAppType = 'STAY_THE_CLAIM';

let civilCaseReference, gaCaseReference, state;

Feature('GA 1v1 Judge make decision order made API tests');

Scenario('Judge makes decision 1V1 - Order Made @api-tests @api-scheduler-test', async ({api}) => {

  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', '11000');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithStayClaim(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');
  console.log('*** Start Judge makes decision order made and : ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    state = await api.judgeMakesDecisionOrderMadeStayClaimAppln(config.judgeUser2WithRegionId2, gaCaseReference);
  } else {
    state = await api.judgeMakesDecisionOrderMadeStayClaimAppln(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes decision order made - GA Case Reference: ' + gaCaseReference + ' ***');
}).retry(1);

Scenario('Judge Revisit 1V1 - Order Made End Date Scheduler @api-scheduler-test', async ({api}) => {

  console.log('*** Triggering Judge Revisit Order Made Scheduler ***');
  await api.judgeRevisitScheduler(gaCaseReference, state, genAppType);
  console.log('*** End of Judge Revisit Order Made Scheduler ***');

}).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
