/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const states = require('../../fixtures/ga-ccd/state.js');
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let parentCaseNumber, caseId, childCaseId, childCaseNumber, gaCaseReference;

Feature('GA CCD 1v1 - General Application Journey');

Before(async ({api}) => {
  parentCaseNumber = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, 'ONE_V_ONE', 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, 'ONE_V_TWO_TWO_LEGAL_REP', parentCaseNumber);
  await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNumber);
  console.log('Case created for general application: ' + parentCaseNumber);
});

Scenario('GA for 1v1 - Make an order journey @e2e-tests', async ({I, api}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(3, 4),
    parentCaseNumber, '' +
    'yes', 'no', 'no', 'no', 'no', 'no', 'no',
    'disabledAccess');
  console.log('1v1 General Application created: ' + parentCaseNumber);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, parentCaseNumber);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(3, 4), 1);
  await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  childCaseId = await I.grabCaseNumber();
  await I.dontSee('Go');
  await I.dontSee('Next step');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeMakeDecision('makeAnOrder', 'approveOrEditTheOrder', 'no', childCaseNum(), 'General_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Approve order', 'no');
  await I.verifyApplicationDocument('General order');
  console.log('Judges made a decision on case: ' + childCaseNum());
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(states.ORDER_MADE.name);
  await I.verifyClaimDocument('General order document');
  await I.login(config.defendantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  I.see('Applications', 'div.mat-tab-label-content');
}).retry(1);

Scenario('GA for 1v1 - Direction order journey @multiparty-e2e-tests @ui-nightly', async ({I, api}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 4),
    parentCaseNumber,
    'no', 'no', 'no', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + parentCaseNumber);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, parentCaseNumber);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(0, 4), 1);
  await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  childCaseId = await I.grabCaseNumber();
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeMakeDecision('makeAnOrder', 'giveDirections', 'no', childCaseNum(), 'Directions_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Judges Directions', 'no');
  await I.verifyApplicationDocument('Directions order');
  console.log('Judges Directions Order Made on case: ' + childCaseNum());
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(states.AWAITING_DIRECTIONS_ORDER_DOCS.name);
  await I.verifyClaimDocument('Directions order document');
  await I.respondToJudgesDirections(childCaseNum(), childCaseId);
  console.log('Responded to Judges directions on case: ' + childCaseNum());
  await I.login(config.defendantSolicitorUser);
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(states.AWAITING_DIRECTIONS_ORDER_DOCS.name);
  await I.see(childCaseNumber);
}).retry(1);

Scenario('GA for 1v1 Specified Claim- Dismissal order journey @multiparty-e2e-tests @ui-nightly', async ({I, api}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 4),
    parentCaseNumber,
    'no', 'no', 'no', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + parentCaseNumber);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, parentCaseNumber);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(0, 4), 1);
  await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  childCaseId = await I.grabCaseNumber();
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeMakeDecision('makeAnOrder', 'dismissTheApplication', 'no', childCaseNum(), 'Dismissal_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Dismissal order', 'no');
  await I.verifyApplicationDocument('Dismissal order');
  await I.dontSee('Go');
  await I.dontSee('Next step');
  console.log('Judges Dismissed this order: ' + childCaseNum());
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(states.APPLICATION_DISMISSED.name);
  await I.verifyClaimDocument('Dismissal order document');
  await I.login(config.defendantSolicitorUser);
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(states.APPLICATION_DISMISSED.name);
  await I.see(childCaseNumber);
}).retry(1);

Scenario('GA for 1v1- respond to application - Request more information @ui-nightly', async ({I, api}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 5),
    parentCaseNumber,
    'no', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + parentCaseNumber);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, parentCaseNumber);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(0, 5), 1);
  await I.see(states.AWAITING_RESPONDENT_RESPONSE.name);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  await I.verifyApplicantSummaryPage();
  childCaseId = await I.grabCaseNumber();
  await I.login(config.defendantSolicitorUser);
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 5));
  console.log('Org1 solicitor Responded to application: ' + childCaseNum());
  await I.respCloseAndReturnToCaseDetails(childCaseId);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION', config.defendantSolicitorUser);
  await I.dontSee('Go');
  await I.dontSee('Next step');
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeRequestMoreInfo('requestMoreInfo', 'requestMoreInformation', childCaseNum(), 'yes', 'Request_for_information');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.defendantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Request more information', 'yes');
  await I.verifyApplicationDocument('Request for information');
  console.log('Judges requested more information on case: ' + childCaseNum());
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(states.AWAITING_ADDITIONAL_INFORMATION.name);
  await I.respondToJudgeAdditionalInfo(childCaseNum(), childCaseId);
  console.log('Responded to Judge Additional Information on case: ' + childCaseNum());
}).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
