/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const judgeDirectionsOrderStatus = 'Directions Order Made';
const judgeApproveOrderStatus = 'Order Made';
const judgeDismissOrderStatus = 'Application Dismissed';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let parentCaseNumber, caseId, childCaseId, childCaseNumber, gaCaseReference;

Feature('GA CCD 1v1 - General Application Journey @e2e-tests');

Scenario('GA for 1v1 - Make an order journey', async ({I, api}) => {
  parentCaseNumber = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, parentCaseNumber);
  await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNumber);
  console.log('Case created for general application: ' + parentCaseNumber);
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
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(3, 4), 1);
  await I.see(judgeDecisionStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  childCaseId = await I.grabCaseNumber();
  await I.judgeMakeDecision('makeAnOrder', 'approveOrEditTheOrder', 'yes', childCaseNum());
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'JUDGE_MAKES_DECISION');
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyApplicationDocument(childCaseNum(), 'General order');
  console.log('Judges made a decision on case: ' + childCaseNum());
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(judgeApproveOrderStatus);
  await I.navigateToCaseDetails(childCaseNum());
  await I.dontSee('Go');
  await I.dontSee('Next step');
  await I.login(config.defendantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  I.dontSee('Applications', 'div.mat-tab-label-content');
}).retry(0);

Scenario('GA for 1v1 - Direction order journey', async ({I, api}) => {
  parentCaseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, parentCaseNumber);
  await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNumber);
  console.log('Case created for general application: ' + parentCaseNumber);
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
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(0, 4), 1);
  await I.see(judgeDecisionStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  childCaseId = await I.grabCaseNumber();
  await I.judgeMakeDecision('makeAnOrder', 'giveDirections', 'no', childCaseNum());
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'JUDGE_MAKES_DECISION');
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Judges Directions');
  await I.verifyApplicationDocument(childCaseNum(), 'Direction order');
  console.log('Judges Directions Order Made on case: ' + childCaseNum());
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(judgeDirectionsOrderStatus);
  await I.respondToJudgesDirections(childCaseNum(), childCaseId);
  console.log('Responded to Judges directions on case: ' + childCaseNum());
}).retry(0);

Scenario('GA for 1v1 - Dismissal order journey', async ({I, api}) => {
  parentCaseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, parentCaseNumber);
  await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNumber);
  console.log('Case created for general application: ' + parentCaseNumber);
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
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(0, 4), 1);
  await I.see(judgeDecisionStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  childCaseId = await I.grabCaseNumber();
  await I.judgeMakeDecision('makeAnOrder', 'dismissTheApplication', 'no', childCaseNum());
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'JUDGE_MAKES_DECISION');
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Dismissal order');
  await I.verifyApplicationDocument(childCaseNum(), 'Dismissal order');
  await I.dontSee('Go');
  await I.dontSee('Next step');
  console.log('Judges Dismissed this order: ' + childCaseNum());
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(judgeDismissOrderStatus);
}).retry(0);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
