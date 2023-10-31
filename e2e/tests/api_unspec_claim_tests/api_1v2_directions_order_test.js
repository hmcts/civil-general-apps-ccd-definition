/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const genAppType = 'STAY_THE_CLAIM';

let civilCaseReference, gaCaseReference;

Feature('GA 1v2 Judge Make Order Directions Order API tests @api-nightly');

Scenario('Judge makes decision 1V2 - DIRECTIONS ORDER @123', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');
  let state;
  console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    state = await api.judgeMakesDecisionDirectionsOrder(config.judgeUser, gaCaseReference);
  } else {
    state = await api.judgeMakesDecisionDirectionsOrder(config.judgeLocalUser, gaCaseReference);
  }
  await api.judgeRevisitScheduler(gaCaseReference, state, genAppType);
  console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');
});

AfterSuite(async ({api}) => {
  // await api.cleanUp();
});

