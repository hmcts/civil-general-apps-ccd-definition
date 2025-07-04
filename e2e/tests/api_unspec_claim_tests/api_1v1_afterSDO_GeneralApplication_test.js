/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const claimAmountJudge = '11000';
let civilCaseReference, gaCaseReference;

Feature('Unspec 1v1 - General Application after SDO Journey @api-nonprod');

Scenario('Claimant create GA - JUDICIAL_REFERRAL state', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', claimAmountJudge);
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge makes decision order made: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMade(config.judgeUser2WithRegionId2, gaCaseReference);
  } else {
    await api.judgeMakesDecisionOrderMade(config.judgeLocalUser, gaCaseReference);
  }
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  await api.verifyGALocation(config.applicantSolicitorUser, gaCaseReference, civilCaseReference);
}).retry(1);

Scenario('Birmingham should have access to the GA Feature post SDO (JUDICIAL REFERRAL) @e2e-nonprod', async ({I,api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario,
      'Company', '11000', true);
    await api.amendClaimDocuments(config.applicantSolicitorUser);
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
    await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
    await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
    await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
    console.log('Make a General Application');
    gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
}).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
