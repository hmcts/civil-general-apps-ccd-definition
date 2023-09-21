/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');
const {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
const states = require('../../fixtures/ga-ccd/state.js');

const mpScenario = 'ONE_V_ONE';
const awaitingPaymentStatus = states.AWAITING_APPLICATION_PAYMENT.name;
const respondentStatus = states.AWAITING_RESPONDENT_RESPONSE.name;
const claimantType = 'Company';
let civilCaseReference, gaCaseReference, user;

Feature('GA R2 1v1 - General Application Journey @ui-nightly');

BeforeSuite(async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, claimantType);
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Case created for general application: ' + civilCaseReference);
});

Scenario('Defendant of main claim initiates Vary Judgement application @regression3', async ({I, api}) => {
  await I.login(config.applicantSolicitorUser);
  await I.verifyNoN245Form(civilCaseReference, getAppTypes().slice(10, 11), 'no');
  await I.login(config.defendantSolicitorUser);
  await I.initiateVaryJudgementGA(civilCaseReference, getAppTypes().slice(10, 11), 'yes', 'no', 'no');
  gaCaseReference = await api.getGACaseReference(config.defendantSolicitorUser, civilCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    states.AWAITING_APPLICATION_PAYMENT.id, config.defendantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(10, 11), 1);
  await I.see(awaitingPaymentStatus);
  await I.navigateToTab(gaCaseReference, 'Application');
  await I.verifyN245FormElements();
  await I.clickOnTab('Application Documents');
  await I.verifyN245FormElements();

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    user = config.judgeUser;
    await I.login(user);
  } else {
    user = config.judgeLocalUser;
    await I.login(user);
  }
  await I.verifyCaseFileAppDocument(civilCaseReference, 'No document');
  await I.login(config.applicantSolicitorUser);
  await I.verifyCaseFileAppDocument(civilCaseReference, 'No document');

  await I.payAndVerifyGAStatus(civilCaseReference, gaCaseReference,
    states.AWAITING_RESPONDENT_RESPONSE.id, config.defendantSolicitorUser, respondentStatus);

  await I.login(config.applicantSolicitorUser);
  await I.respondToVaryJudgementApp(gaCaseReference, getAppTypes().slice(10, 11), 'doNotAccept', 'fullPayment');
  await I.respCloseAndReturnToCaseDetails();
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.id, config.applicantSolicitorUser);

  await api.judgeListApplicationForHearing(user, gaCaseReference);
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'LISTING_FOR_A_HEARING');
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'LISTING_FOR_A_HEARING');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');

  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(states.LISTING_FOR_A_HEARING.name);
  await I.verifyCaseFileAppDocument(civilCaseReference, 'N245 Evidence');
});

Scenario('GA R2 1v1 - With Notice - Unless order - Make an order journey  @regression2', async ({I, api}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.createGeneralApplication(
    getAppTypes().slice(9, 10),
    civilCaseReference, '' +
    'no', 'no', 'yes', 'no', 'no', 'no', 'no',
    'disabledAccess');
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    states.AWAITING_APPLICATION_PAYMENT.id, config.applicantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(9, 10), 1);
  await I.see(awaitingPaymentStatus);
  await I.payAndVerifyGAStatus(civilCaseReference, gaCaseReference,
    states.AWAITING_RESPONDENT_RESPONSE.id, config.applicantSolicitorUser, respondentStatus);

  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMade(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeMakesDecisionOrderMade(config.judgeLocalUser, gaCaseReference);
  }

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, states.ORDER_MADE.id);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
