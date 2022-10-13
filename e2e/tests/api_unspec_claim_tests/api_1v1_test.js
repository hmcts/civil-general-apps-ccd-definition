/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const mpScenario1 = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference;

Feature('CCD 1v1 API test');

Scenario('Create Unspec claim', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario1, 'Company');
   await api.notifyClaim(config.applicantSolicitorUser, mpScenario1, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);

  console.log('Created UnSpec claim for general application: ' + civilCaseReference);
});

Scenario('Create Spec claim', async ({I, api}) => {
  civilCaseReference = await api.createSpecifiedClaim(config.applicantSolicitorUser, 'ONE_V_TWO');

  console.log('Created Spec claim for general application: ' + civilCaseReference);
});

