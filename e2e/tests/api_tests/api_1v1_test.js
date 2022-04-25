/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let parentCaseNumber;

Feature('GA 1v1 API tests @api-tests');

Scenario('Create General application', async ({api}) => {
  parentCaseNumber = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + parentCaseNumber);
  // To do GA API test
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

