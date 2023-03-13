/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');
const {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');


const mpScenario = 'ONE_V_ONE';
const awaitingPaymentStatus = 'Awaiting Application Payment';
const judgeDecisionStatus = 'Awaiting Respondent Response';
const respondentStatus = 'Awaiting Respondent Response';
const claimantType = 'Company';
let civilCaseReference, gaCaseReference;

Feature('GA R2 1v1 - General Application Journey @ui-nightly');

Scenario('GA R2 1v1 - Without Notice - Vary Judgement - Hearing order journey @non-prod-e2e', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, claimantType);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Case created for general application: ' + civilCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.initiateVaryJudgementGA(civilCaseReference, getAppTypes().slice(10, 11), 'yes', 'no', 'no');
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    'AWAITING_APPLICATION_PAYMENT', config.applicantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(10, 11), 1);
  await I.see(awaitingPaymentStatus);
  await I.navigateToCaseDetails(gaCaseReference);
  await I.clickOnTab('Application Documents');
  await I.payAndVerifyGAStatusWithNotice(civilCaseReference, gaCaseReference,
    'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser, judgeDecisionStatus);

  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }

  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'LISTING_FOR_A_HEARING');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, null);
});

Scenario('GA R2 1v1 - With Notice - Unless order - Make an order journey', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, claimantType);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Case created for general application: ' + civilCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.createGeneralApplication(
    getAppTypes().slice(9, 10),
    civilCaseReference, '' +
    'no', 'no', 'yes', 'no', 'no', 'no', 'no',
    'disabledAccess');
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    'AWAITING_APPLICATION_PAYMENT', config.applicantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(9, 10), 1);
  await I.see(awaitingPaymentStatus);
  await I.payAndVerifyGAStatusWithNotice(civilCaseReference, gaCaseReference,
    'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser, respondentStatus);

  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMade(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeMakesDecisionOrderMade(config.judgeLocalUser, gaCaseReference);
  }

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'ORDER_MADE');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
