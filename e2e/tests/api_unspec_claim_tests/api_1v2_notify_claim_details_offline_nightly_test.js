/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference,
  gaCaseReference;

Feature('GA 1v2 Notify Claim Details Case Close API tests @api-offline-nightly @api-nightly');

Scenario('Case offline 1V2 notify_claim_details AWAITING_DIRECTIONS_ORDER_DOCS', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

  gaCaseReference
    = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionDirectionsOrder(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeMakesDecisionDirectionsOrder(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge List the application for hearing GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('Case offline');
  await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 notify_claim_details ORDER_MADE', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

  console.log('Make a General Application with state ORDER_MADE');
  gaCaseReference
    = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  console.log('*** Start Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
    + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesOrderDecisionUncloak(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeMakesOrderDecisionUncloak(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('Case offline');
  await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'ORDER_MADE');
});

Scenario('Case offline 1V2 notify_claim_details APPLICATION_DISMISSED', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

  console.log('Make a General Application with state APPLICATION_DISMISSED');
  gaCaseReference
    = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** Start Judge Make Decision Application Dismiss on GA Case Reference: '
    + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeDismissApplication(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeDismissApplication(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge Make Decision Application Dismiss on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('Case offline');
  await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'APPLICATION_DISMISSED');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
