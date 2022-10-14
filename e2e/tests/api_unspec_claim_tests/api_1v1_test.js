/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let caseId;

Feature('CCD 1v1 API test');

Scenario.only('Create Unspec claim', async ({api}) => {
  await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaimDetails(config.applicantSolicitorUser);
  caseId = await api.getCaseId();
  console.log('Created UnSpec claim for general application: ' + caseId);
});

/*Scenario('Create Spec claim', async ({I, api}) => {
  civilCaseReference = await api.createSpecifiedClaim(config.applicantSolicitorUser, 'ONE_V_TWO');

  console.log('Created Spec claim for general application: ' + civilCaseReference);
});*/

