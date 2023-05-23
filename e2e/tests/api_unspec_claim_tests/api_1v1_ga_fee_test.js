/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('GA 1v1 GA Fee API tests @api-tests');

Scenario('MixTypesWithVary - 14 pounds', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaWithTypes(
    config.applicantSolicitorUser, civilCaseReference, ['VARY_JUDGEMENT','EXTEND_TIME','STAY_THE_CLAIM'],
    '1400', 'FEE0458');
});

Scenario('MixTypesWithSetAside - 108 pounds', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
      config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaWithTypes(
      config.applicantSolicitorUser, civilCaseReference, ['SET_ASIDE_JUDGEMENT','EXTEND_TIME','STAY_THE_CLAIM'],
      '10800', 'FEE0443');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
