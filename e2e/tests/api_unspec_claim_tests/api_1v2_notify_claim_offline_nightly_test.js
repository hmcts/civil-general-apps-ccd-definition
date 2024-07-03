/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference,
  gaCaseReference;

Feature('GA Claim 1v2 Notify Claim Case Close API tests @api-offline-nightly @api-nightly');
// This test should be enabled after early adopters goes live for all regions

Scenario('Case offline 1V2 notify_claim_details AWAITING_ADDITIONAL_INFORMATION', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);

  gaCaseReference
    = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionAdditionalInformation(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeMakesDecisionAdditionalInformation(config.judgeLocalUser, gaCaseReference);
  }

  console.log('*** Start Respondent respond to Judge Additional information on GA Case Reference: '
    + gaCaseReference + ' ***');
  await api.respondentResponseToJudgeAdditionalInfo(config.applicantSolicitorUser, gaCaseReference);
  console.log('*** End Respondent respond to Judge Additional information on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('Case offline');
  await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
