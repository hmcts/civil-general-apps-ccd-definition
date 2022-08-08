/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const mpScenario = 'ONE_V_TWO_ONE_LEGAL_REP';
const respondentStatus = 'Awaiting Respondent Response';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const writtenRepStatus = 'Awaiting Written Representations';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');

let {getAppTypes} = require('../../../pages/generalApplication/generalApplicationTypes');
let parentCaseNum, caseId, childCaseNumber, childCaseId, gaCaseReference;

Feature('GA CCD 1v2 Same Solicitor - General Application Journey @multiparty-e2e-tests');

Scenario('GA for 1v2 Same Solicitor - respond to application - Sequential written representations journey', async ({I, api}) => {
  parentCaseNum = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, parentCaseNum);
  await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNum);
  console.log('Case created for general application: ' + parentCaseNum);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNum);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 1),
    parentCaseNum, '' +
    'no', 'no', 'yes', 'no', 'no', 'no', 'no',
    'disabledAccess');
  console.log('General Application created: ' + parentCaseNum);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, parentCaseNum);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNum, 'Applications', getAppTypes().slice(0, 1), 1);
  await I.see(respondentStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.login(config.defendantSolicitorUser);
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 1));
  console.log('Org1 solicitor responded to application: ' + childCaseNum());
  childCaseId = await I.grabGACaseNumber();
  await I.respCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyResponseSummaryPage();
  await I.navigateToTab(parentCaseNum, 'Applications');
  await I.see(judgeDecisionStatus);
  // We currently do not have JUDGE role in role assignment service. Hence, not log in as judge.
  await I.judgeWrittenRepresentationsDecision('orderForWrittenRepresentations', 'sequentialRep', childCaseNum());
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'JUDGE_MAKES_DECISION');
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Sequential representations');
  await I.verifyApplicationDocument(childCaseNum(), 'Written representation sequential');
  console.log('Judges made an order for Sequential written representations on case: ' + childCaseNum());
  await I.navigateToTab(parentCaseNum, 'Applications');
  await I.see(writtenRepStatus);
  await I.respondToJudgesWrittenRep(childCaseNum(), childCaseId);
  console.log('Responded to Judges written representations on case: ' + childCaseNum());
}).retry(0);

Scenario('GA for 1v2 Same Solicitor - Send application to other party journey',
  async ({I, api}) => {
    parentCaseNum = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario);
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, parentCaseNum);
    await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNum);
    console.log('Case created for general application: ' + parentCaseNum);
    await I.login(config.applicantSolicitorUser);
    await I.navigateToCaseDetails(parentCaseNum);
    caseId = await I.grabCaseNumber();
    await I.createGeneralApplication(
      getAppTypes().slice(0, 5),
      parentCaseNum,
      'no', 'no', 'no', 'yes', 'yes', 'yes', 'no',
      'signLanguageInterpreter');
    console.log('General Application created: ' + parentCaseNum);
    gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, parentCaseNum);
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
    await I.closeAndReturnToCaseDetails(caseId);
    await I.clickAndVerifyTab(parentCaseNum, 'Applications', getAppTypes().slice(0, 5), 1);
    await I.see(judgeDecisionStatus);
    childCaseNumber = await I.grabChildCaseNumber();
    await I.navigateToCaseDetails(childCaseNum());
    childCaseId = await I.grabCaseNumber();
    await I.judgeRequestMoreInfo('requestMoreInfo', 'sendApplicationToOtherParty', childCaseNum(), 'no');
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'JUDGE_MAKES_DECISION');
    await I.judgeCloseAndReturnToCaseDetails(childCaseId);
    console.log('Judges sent application to other party and requested hearing details on case: ' + childCaseNum());
  }).retry(0);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
