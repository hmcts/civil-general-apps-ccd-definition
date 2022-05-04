/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let parentCaseNumber;

Feature('GA 1v1 API tests @api-tests');

Scenario('Initiate General application for 1v1', async ({api}) => {
  parentCaseNumber = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + parentCaseNumber);
  await api.initiateGeneralApplication(config.applicantSolicitorUser, parentCaseNumber);

  //await api.respondentResponse(config.defendantSolicitorUser, parentCaseNumber);

});

/*AfterSuite(async ({api}) => {
  await api.cleanUp();
});*/

