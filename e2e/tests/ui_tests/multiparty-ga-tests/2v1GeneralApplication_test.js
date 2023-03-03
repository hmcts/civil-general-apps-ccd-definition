/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const {getAppTypes} = require('../../../pages/generalApplication/generalApplicationTypes');

const mpScenario = 'TWO_V_ONE';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const writtenRepStatus = 'Awaiting Written Representations';
const claimantType = 'Company';
const awaitingPaymentStatus = 'Awaiting Application Payment';
let civilCaseReference, gaCaseReference;

Feature('GA CCD 2v1 - General Application Journey @multiparty-e2e-tests @ui-nightly');

Scenario('GA for 2v1 - Concurrent written representations - without notice to with notice journey', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, claimantType);
  await api.amendClaimDocuments(config.applicantSolicitorUser);
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
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser);
  await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(0, 4), 1);
  await I.see(awaitingPaymentStatus);
  await I.payAndVerifyGAStatus(civilCaseReference, gaCaseReference,
    'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION', config.applicantSolicitorUser, judgeDecisionStatus);

  console.log('Judge Making decision:' + gaCaseReference);
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeWrittenRepresentationsDecision('orderForWrittenRepresentations', 'concurrentRep', gaCaseReference, 'withOutNotice', 'Order_Written_Representation_Concurrent');

  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference);
  }

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  console.log('*** End Callback for Additional Payment on GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Respondent respond to Judge Additional information on GA Case Reference: '
    + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Respondent respond to Judge Additional information on GA Case Reference: '
    + gaCaseReference + ' ***');

  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeWrittenRepresentationsDecision('orderForWrittenRepresentations', 'concurrentRep', gaCaseReference, 'no', 'Order_Written_Representation_Concurrent');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails();
  await I.verifyJudgesSummaryPage('Concurrent representations', 'no');
  await I.verifyApplicationDocument('Written representation concurrent');
  console.log('Judges made an order for Concurrent written representations on case: ' + gaCaseReference);

  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(writtenRepStatus);
  await I.respondToJudgesWrittenRep(gaCaseReference, 'Written representation concurrent document');
  console.log('Responded to Judges written representations on case: ' + gaCaseReference);
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'AWAITING_WRITTEN_REPRESENTATIONS');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
