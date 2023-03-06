/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess, waitForGAFinishedBusinessProcess} = require('../../api/testingSupport');
const {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');

const mpScenario = 'ONE_V_ONE';
const awaitingPaymentStatus = 'Awaiting Application Payment';
const respondentStatus = 'Awaiting Respondent Response';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const judgeDirectionsOrderStatus = 'Directions Order Made';
const judgeApproveOrderStatus = 'Order Made';
const judgeDismissOrderStatus = 'Application Dismissed';
const additionalInfoStatus = 'Additional Information Required';
const claimantType = 'Company';

let civilCaseReference, gaCaseReference;

Feature('GA CCD 1v1 - General Application Journey  @ui-nightly @mmm');

Scenario('GA for 1v1 - Make an order journey @e2e-tests', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, claimantType);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Case created for general application: ' + civilCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.createGeneralApplication(
    getAppTypes().slice(3, 4),
    civilCaseReference, '' +
    'yes', 'no', 'no', 'no', 'no', 'no', 'no',
    'disabledAccess');
  console.log('1v1 General Application created: ' + civilCaseReference);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    'AWAITING_APPLICATION_PAYMENT', config.applicantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(3, 4), 1);
  await I.see(awaitingPaymentStatus);
  await I.payAndVerifyGAStatus(civilCaseReference, gaCaseReference,
    'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION', config.applicantSolicitorUser, judgeDecisionStatus);

  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeMakeDecision('makeAnOrder', 'approveOrEditTheOrder', 'no', gaCaseReference, 'General_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'ORDER_MADE', config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails();
  await I.verifyJudgesSummaryPage('Approve order', 'no');
  await I.verifyApplicationDocument('General order');
  console.log('Judges made a decision on case: ' + gaCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(judgeApproveOrderStatus);
  await I.verifyClaimDocument('General order document');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
});

Scenario('GA for 1v1 - Direction order journey', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, claimantType);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Case created for general application: ' + civilCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.createGeneralApplication(
    getAppTypes().slice(0, 4),
    civilCaseReference,
    'no', 'no', 'no', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + civilCaseReference);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    'AWAITING_APPLICATION_PAYMENT', config.applicantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(0, 4), 1);
  await I.see(awaitingPaymentStatus);
  await I.navigateToCaseDetails(gaCaseReference);
  await I.payForGA();
  await waitForGAFinishedBusinessProcess(civilCaseReference, config.applicantSolicitorUser);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION', config.applicantSolicitorUser);
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(judgeDecisionStatus);

  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeMakeDecision('makeAnOrder', 'giveDirections', 'no', gaCaseReference, 'Directions_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'ORDER_MADE', config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails();
  await I.verifyJudgesSummaryPage('Judges Directions', 'no');
  await I.verifyApplicationDocument('Directions order');
  console.log('Judges Directions Order Made on case: ' + gaCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(judgeDirectionsOrderStatus);
  await I.verifyClaimDocument('Directions order document');
  await I.respondToJudgesDirections(gaCaseReference);
  console.log('Responded to Judges directions on case: ' + gaCaseReference);
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'AWAITING_DIRECTIONS_ORDER_DOCS');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
});

Scenario('GA for 1v1 Specified Claim- Dismissal order journey', async ({I, api}) => {
  civilCaseReference = await api.createSpecifiedClaim(config.applicantSolicitorUser, mpScenario, claimantType);
  console.log('Case created for general application: ' + civilCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.createGeneralApplication(
    getAppTypes().slice(0, 4),
    civilCaseReference,
    'no', 'no', 'no', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + civilCaseReference);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    'AWAITING_APPLICATION_PAYMENT', config.applicantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(0, 4), 1);
  await I.see(awaitingPaymentStatus);
  await I.payAndVerifyGAStatus(civilCaseReference, gaCaseReference,
    'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION', config.applicantSolicitorUser, judgeDecisionStatus);

  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeMakeDecision('makeAnOrder', 'dismissTheApplication', 'no', gaCaseReference, 'Dismissal_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'APPLICATION_DISMISSED', config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails();
  await I.verifyJudgesSummaryPage('Dismissal order', 'no');
  await I.verifyApplicationDocument('Dismissal order');
  await I.dontSee('Go');
  await I.dontSee('Next step');
  console.log('Judges Dismissed this order: ' + gaCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(judgeDismissOrderStatus);
  await I.verifyClaimDocument('Dismissal order document');
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'APPLICATION_DISMISSED');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
});

Scenario('GA for 1v1- respond to application - Request more information', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Case created for general application: ' + civilCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.createGeneralApplication(
    getAppTypes().slice(0, 5),
    civilCaseReference,
    'no', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + civilCaseReference);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    'AWAITING_APPLICATION_PAYMENT', config.applicantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(0, 5), 1);
  await I.see(awaitingPaymentStatus);
  await I.payAndVerifyGAStatus(civilCaseReference, gaCaseReference,
    'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser, respondentStatus);

  await I.login(config.defendantSolicitorUser);
  await I.respondToApplication(gaCaseReference, 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 5));
  console.log('Org1 solicitor Responded to application: ' + gaCaseReference);
  await I.respCloseAndReturnToCaseDetails();
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION', config.defendantSolicitorUser);
  await I.dontSee('Go');
  await I.dontSee('Next step');
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(judgeDecisionStatus);

  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeRequestMoreInfo('requestMoreInfo', 'requestMoreInformation', gaCaseReference, 'yes', 'Request_for_information');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_ADDITIONAL_INFORMATION ', config.defendantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails();
  await I.verifyJudgesSummaryPage('Request more information', 'yes');
  await I.verifyApplicationDocument('Request for information');
  console.log('Judges requested more information on case: ' + gaCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(additionalInfoStatus);
  await I.respondToJudgeAdditionalInfo(gaCaseReference);
  console.log('Responded to Judge Additional Information on case: ' + gaCaseReference);
});

AfterSuite(async ({api}) => {
   await api.cleanUp();
});
