/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('GA 1v1 Judge Make Order Directions Order API tests @api-tests');

Scenario('Initiate General application for 1v1', async ({api}) => {
  civilCaseReference = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);
});

Scenario('Respondent response for 1V1', async ({api}) => {
  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');
});

Scenario('Judge makes decision 1V1 - DIRECTIONS ORDER', async ({api}) => {
  console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
  await api.judgeMakesDecisionDirectionsOrder(config.applicantSolicitorUser, gaCaseReference);
  console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

