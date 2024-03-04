/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const states = require('../../fixtures/ga-ccd/state.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const hnStateStatus = states.HEARING_SCHEDULED.id;

let civilCaseReference, gaCaseReference;

Feature('GA 1v2 Judge makes order application after hearing API tests @api-nightly');

Scenario('Without Notice Hearing notice journey @mm', async ({api}) => {

  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser,
    mpScenario, 'SoleTrader', '11000');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.defendantResponseClaim(config.secondDefendantSolicitorUser, mpScenario, 'solicitorTwo');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.defendantSolicitorUser, civilCaseReference);

});

AfterSuite(async ({api}) => {
  //await api.cleanUp();
});
