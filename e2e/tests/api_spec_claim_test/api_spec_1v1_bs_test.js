/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('GA SPEC Claim 1v1 Breathing Space API tests @api-tests');

Scenario('1V1 - STANDARD - Breathing Space', async ({api}) => {
  civilCaseReference = await api.createSpecifiedClaim(
    config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for breathing space: ' + civilCaseReference);
  let type = 'STANDARD';
  await api.breathingSpaceClaimSpec(
      civilCaseReference, config.applicantSolicitorUser, type, true);
  await api.breathingSpaceClaimSpec(
      civilCaseReference, config.applicantSolicitorUser, type, false);
});

Scenario('1V1 - MENTAL_HEALTH - Breathing Space', async ({api}) => {
  civilCaseReference = await api.createSpecifiedClaim(
      config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for breathing space: ' + civilCaseReference);
  let type = 'MENTAL_HEALTH';
  await api.breathingSpaceClaimSpec(
      civilCaseReference, config.applicantSolicitorUser, type, true);
  await api.breathingSpaceClaimSpec(
      civilCaseReference, config.applicantSolicitorUser, type, false);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});


