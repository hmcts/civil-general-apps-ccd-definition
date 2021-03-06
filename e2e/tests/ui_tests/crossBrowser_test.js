/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const respondentStatus = 'Awaiting Respondent Response';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const additionalInfoStatus = 'Additional Information Required';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let parentCaseNumber, caseId, childCaseId, childCaseNumber, gaCaseReference;
Feature('End-to-end General application journey @cross-browser-tests');

Scenario('End to End Judges Journey', async ({I, api}) => {
  parentCaseNumber = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaimDetails(config.applicantSolicitorUser);
  console.log('Case created for general application: ' + parentCaseNumber);
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
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(0, 5), 1);
  await I.see(respondentStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  await I.verifyApplicantSummaryPage();
  childCaseId = await I.grabCaseNumber();
  await I.login(config.defendantSolicitorUser);
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 5));
  console.log('Org1 solicitor Responded to application: ' + childCaseNum());
  await I.respCloseAndReturnToCaseDetails(childCaseId);
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(judgeDecisionStatus);
  // await I.judgeRequestMoreInfo('requestMoreInfo', 'requestMoreInformation', childCaseNum());
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'JUDGE_MAKES_DECISION');
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Request more information');
  await I.verifyApplicationDocument(childCaseNum(), 'Request for information');
  console.log('Judges requested more information on case: ' + childCaseNum());
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(additionalInfoStatus);
  await I.respondToJudgeAdditionalInfo(childCaseNum(), childCaseId);
  console.log('Responded to Judge Additional Information on case: ' + childCaseNum());
}).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

