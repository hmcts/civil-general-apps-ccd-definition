/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const {
  waitForGACamundaEventsFinishedBusinessProcess
} = require('../../api/testingSupport');
const {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
const states = require('../../fixtures/ga-ccd/state.js');

const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const awaitingPaymentStatus = states.AWAITING_APPLICATION_PAYMENT.name;
const respondentStatus = states.AWAITING_RESPONDENT_RESPONSE.name;
const judgeApproveOrderStatus = states.ORDER_MADE.name;
const claimantType = 'Company';
const doc = 'hearingNotice';

let civilCaseReference, gaCaseReference, user;
Feature('End-to-end General application journey @cross-browser-tests');

Scenario('GA - Make an order journey', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, 'ONE_V_ONE', claimantType);
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, 'ONE_V_ONE', civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Case created for general application: ' + civilCaseReference);
/*  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.createGeneralApplication(
    getAppTypes().slice(3, 4),
    civilCaseReference, '' +
    'yes', 'no', 'no', 'no', 'no', 'no', 'no',
    'disabledAccess');
  console.log('1v1 General Application created: ' + civilCaseReference);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    states.AWAITING_APPLICATION_PAYMENT.id, config.applicantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(3, 4), 1);
  await I.see(awaitingPaymentStatus);*/
  /*await I.payAndVerifyGAStatus(civilCaseReference, gaCaseReference,
    states.AWAITING_RESPONDENT_RESPONSE.id, config.applicantSolicitorUser, respondentStatus);*/

/*  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    user = config.judgeUser;
    await I.login(user);
  } else {
    user = config.judgeLocalUser;
    await I.login(user);
  }
  await I.judgeMakeDecision('makeAnOrder', 'approveOrEditTheOrder', 'no', gaCaseReference, 'General_order', 'courtOwnInitiativeOrder', user);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.ORDER_MADE.id, config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails();
  await I.verifyJudgesSummaryPage('Approve order', 'no', 'Claimant', user);
  console.log('Judges made a decision on case: ' + gaCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(judgeApproveOrderStatus);*/
}).retry(1);

Scenario('GA - Case progression journey', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUserWithRegionId1, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }

  console.log('Hearing Notice creation');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.nbcAdminWithRegionId4, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeUserWithRegionId1, civilCaseReference, gaCaseReference, doc);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeLocalUser, civilCaseReference, gaCaseReference, doc);
  }
  console.log('Hearing Notice created for: ' + gaCaseReference);

/*  console.log('Judge making Assisted order for: ' + gaCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    user = config.judgeUser;
    await I.login(user);
  } else {
    user = config.judgeLocalUser;
    await I.login(user);
  }
  await I.judgeMakeAppOrder(gaCaseReference, 'freeFromOrder', 'withoutNoticeOrder');
  await I.judgeCloseAndReturnToCaseDetails();
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.ORDER_MADE.id, user);

  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(judgeApproveOrderStatus);
  await I.verifyCaseFileAppDocument(civilCaseReference, 'Hearing Notice');*/
}).retry(1);

AfterSuite(async ({api}) => {
   await api.cleanUp();
});

