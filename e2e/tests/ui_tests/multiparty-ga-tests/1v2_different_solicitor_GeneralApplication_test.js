/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const respondentStatus = 'Awaiting Respondent Response';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const listForHearingStatus = 'Listed for a Hearing';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');

let {getAppTypes} = require('../../../pages/generalApplication/generalApplicationTypes');
let parentCaseNumber, caseId, childCaseNumber, childCaseId, gaCaseReference, civilCaseReference;

Feature('1v2 Different Solicitor - General Application Journey @multiparty-e2e-tests');

Scenario('GA for Specified Claim 1v2 different Solicitor - respond to application - Hearing order journey', async ({I, api}) => {
  parentCaseNumber = await api.createSpecifiedClaim(config.applicantSolicitorUser, 'ONE_V_TWO');
  console.log('Case created for general application: ' + parentCaseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 3),
    parentCaseNumber,
    'no', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + parentCaseNumber);
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, parentCaseNumber);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNumber, 'Applications', getAppTypes().slice(0, 3), 1);
  await I.see(respondentStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  await I.verifyApplicantSummaryPage();
  await I.login(config.defendantSolicitorUser);
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 3));
  console.log('Org1 solicitor responded to application: ' + childCaseNum());
  childCaseId = await I.grabGACaseNumber();
  await I.respCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyResponseSummaryPage();
  await I.respondToSameApplicationAndVerifyErrorMsg();
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(respondentStatus);
  await I.login(config.secondDefendantSolicitorUser);
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 3));
  console.log('Org2 solicitor Responded to application: ' + childCaseNum());
  await I.respCloseAndReturnToCaseDetails(childCaseId);
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(judgeDecisionStatus);
  await I.judgeListForAHearingDecision('listForAHearing', childCaseNum());
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION');
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Hearing order');
  await I.verifyApplicationDocument(childCaseNum(), 'Hearing order');
  await I.dontSee('Go');
  await I.dontSee('Next step');
  console.log('Judges list for a hearing on case: ' + childCaseNum());
  await I.navigateToTab(parentCaseNumber, 'Applications');
  await I.see(listForHearingStatus);
}).retry(0);

Scenario('Without Notice application for a hearing @multiparty-e2e-tests', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'SoleTrader');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  await api.judgeListApplicationForHearing(config.applicantSolicitorUser, gaCaseReference);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(listForHearingStatus);
  await I.login(config.defendantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(listForHearingStatus);
  await I.login(config.secondDefendantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see(listForHearingStatus);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
