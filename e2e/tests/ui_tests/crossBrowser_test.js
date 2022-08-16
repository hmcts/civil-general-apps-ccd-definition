/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const respondentStatus = 'Awaiting Respondent Response';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let parentCaseNumber, caseId, childCaseNumber, gaCaseReference, claimantType;
Feature('End-to-end General application journey @cross-browser-tests');

Scenario('GA Applicant and Respondent Journey', async ({I, api}) => {
  claimantType = 'Company';

  parentCaseNumber = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, claimantType);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, parentCaseNumber);
  await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNumber);
  console.log('Case created for general application: ' + parentCaseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 5),
    parentCaseNumber,
    'yes', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + parentCaseNumber);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, parentCaseNumber);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(0, 5), 1);
  await I.see(respondentStatus);
  await I.navigateToCaseDetails(childCaseNum());
  await I.verifyApplicantSummaryPage();
}).retry(1);

Scenario('GA Applicant and Judges Journey', async ({I, api}) => {
  parentCaseNumber = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, parentCaseNumber);
  await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNumber);
  console.log('Case created for general application: ' + parentCaseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 4),
    parentCaseNumber,
    'yes', 'no', 'no', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + parentCaseNumber);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, parentCaseNumber);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(0, 4), 1);
  await I.see(judgeDecisionStatus);
}).retry(1);


AfterSuite(async ({api}) => {
  await api.cleanUp();
});

