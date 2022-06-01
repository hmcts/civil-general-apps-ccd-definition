/* eslint-disable no-unused-vars */

const config = require('../../../config.js');
const mpScenario = 'TWO_V_ONE';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const writtenRepStatus = 'Awaiting Written Representations';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');

let {getAppTypes} = require('../../../pages/generalApplication/generalApplicationTypes');
let parentCaseNumber, caseId, childCaseId, childCaseNumber, gaCaseReference;

Feature('GA CCD 2v1 - General Application Journey @multiparty-e2e-tests');

Scenario('GA for 2v1 - Concurrent written representations journey', async ({I, api}) => {
  parentCaseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaimDetails(config.applicantSolicitorUser);
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
  await I.judgeWrittenRepresentationsDecision('orderForWrittenRepresentations', 'concurrentRep', childCaseNum());
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'JUDGE_MAKES_DECISION');
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Concurrent representations');
  await I.verifyApplicationDocument(childCaseNum(), 'Written representation concurrent');
  console.log('Judges made an order for Concurrent written representations on case: ' + childCaseNum());
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(writtenRepStatus);
  await I.respondToJudgesWrittenRep(childCaseNum(), childCaseId);
  console.log('Responded to Judges written representations on case: ' + childCaseNum());
}).retry(0);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
