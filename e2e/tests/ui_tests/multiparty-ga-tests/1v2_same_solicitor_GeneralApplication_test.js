/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const mpScenario = 'ONE_V_TWO_ONE_LEGAL_REP';
const respondentStatus = 'Awaiting Respondent Response';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const writtenRepStatus = 'Awaiting Written Representations';
const additionalPaymentStatus = 'Application Additional Payment';
const additionalInfoStatus = 'Additional Information Required';
const claimantType = 'Company';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');

let {getAppTypes} = require('../../../pages/generalApplication/generalApplicationTypes');
let parentCaseNum, caseId, childCaseNumber, childCaseId, gaCaseReference;

Feature('GA CCD 1v2 Same Solicitor - General Application Journey @multiparty-e2e-tests @ui-nightly');

Scenario('GA for 1v2 Same Solicitor - respond to application - Sequential written representations journey', async ({I, api}) => {
  parentCaseNum = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, claimantType);
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
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNum, 'Applications', getAppTypes().slice(0, 1), 1);
  await I.see(respondentStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.login(config.defendantSolicitorUser);
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 1));
  console.log('Defendant Solicitor responded to application: ' + childCaseNum());
  childCaseId = await I.grabGACaseNumber();
  await I.respCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyResponseSummaryPage();
  await I.navigateToTab(parentCaseNum, 'Applications');
  await I.see(judgeDecisionStatus);
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeWrittenRepresentationsDecision('orderForWrittenRepresentations', 'sequentialRep', childCaseNum(), 'yes', 'Order_Written_Representation_Sequential');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Sequential representations', 'yes');
  await I.verifyApplicationDocument(childCaseNum(), 'Written representation sequential');
  console.log('Judges made an order for Sequential written representations on case: ' + childCaseNum());
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(parentCaseNum, 'Applications');
  await I.see(writtenRepStatus);
  await I.respondToJudgesWrittenRep(childCaseNum(), childCaseId, 'Written Representation Documents');
  console.log('Responded to Judges written representations on case: ' + childCaseNum());
}).retry(1);

Scenario('GA for 1v2 Same Solicitor - Send application to other party journey @e2e-tests',
  async ({I, api}) => {
    parentCaseNum = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, claimantType);
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
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser);
    await I.closeAndReturnToCaseDetails(caseId);
    await I.clickAndVerifyTab(parentCaseNum, 'Applications', getAppTypes().slice(0, 5), 1);
    await I.see(judgeDecisionStatus);
    childCaseNumber = await I.grabChildCaseNumber();
    await I.navigateToCaseDetails(childCaseNum());
    childCaseId = await I.grabCaseNumber();
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await I.login(config.judgeUser);
    } else {
      await I.login(config.judgeLocalUser);
    }
    await I.judgeRequestMoreInfo('requestMoreInfo', 'sendApplicationToOtherParty', childCaseNum(), 'no', 'sendApplicationToOtherParty');
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.applicantSolicitorUser);
    await I.judgeCloseAndReturnToCaseDetails(childCaseId);
    await I.verifyJudgesSummaryPage('Send application to other party', 'no');
    console.log('Judges sent application to other party and requested hearing details on case: ' + childCaseNum());
    await I.login(config.applicantSolicitorUser);
    await I.navigateToTab(parentCaseNum, 'Applications');
    await I.see(additionalPaymentStatus);
    await I.navigateToCaseDetails(childCaseNum());
    await I.dontSee('Go');
    await I.dontSee('Next step');
    await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
    await I.navigateToTab(parentCaseNum, 'Applications');
    await I.see(respondentStatus);
    await I.login(config.defendantSolicitorUser);
    await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
      'signLanguageInterpreter', getAppTypes().slice(0, 5));
    console.log('Defendant Solicitor responded to application: ' + childCaseNum());
    await I.navigateToTab(parentCaseNum, 'Applications');
    await I.see(judgeDecisionStatus);
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await I.login(config.judgeUser);
    } else {
      await I.login(config.judgeLocalUser);
    }
    await I.judgeRequestMoreInfo('requestMoreInfo', 'requestMoreInformation', childCaseNum(), 'yes', 'Request_for_information');
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.applicantSolicitorUser);
    await I.judgeCloseAndReturnToCaseDetails(childCaseId);
    console.log('Judges requested more information on case: ' + childCaseNum());
    await I.login(config.applicantSolicitorUser);
    await I.navigateToTab(parentCaseNum, 'Applications');
    await I.see(additionalInfoStatus);
  }).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
