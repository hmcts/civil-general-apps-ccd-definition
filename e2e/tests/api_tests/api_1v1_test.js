/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('GA 1v1 API tests @api-tests');

Scenario('Initiate General application for 1v1', async ({api}) => {
  civilCaseReference = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + civilCaseReference);
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);
  console.log('General Application Case ID ' + gaCaseReference);
});

Scenario('Respondent response for 1V1', async ({api}) => {
  console.log('*** Respondent response to GA Case ID: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

