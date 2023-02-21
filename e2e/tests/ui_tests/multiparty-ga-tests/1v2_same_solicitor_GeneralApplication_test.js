/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const states = require('../../../fixtures/ga-ccd/state.js');
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');

let {getAppTypes} = require('../../../pages/generalApplication/generalApplicationTypes');
let parentCaseNum, caseId, childCaseNumber, childCaseId, gaCaseReference;

Feature('GA CCD 1v2 Same Solicitor - General Application Journey @multiparty-e2e-tests @ui-nightly');
BeforeSuite(async ({api}) => {
  parentCaseNum = await api.createUnspecifiedClaim(config.applicantSolicitorUser, 'ONE_V_TWO_ONE_LEGAL_REP', 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, 'ONE_V_TWO_ONE_LEGAL_REP', parentCaseNum);
  await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNum);
  console.log('Case created for general application: ' + parentCaseNum);
});

Scenario('GA for 1v2 Same Solicitor - respond to application - Sequential written representations journey', async ({I, api}) => {
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
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    states.AWAITING_RESPONDENT_RESPONSE.id, config.applicantSolicitorUser);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab(parentCaseNum, 'Applications', getAppTypes().slice(0, 1), 1);
  await I.see(states.AWAITING_RESPONDENT_RESPONSE.name);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.login(config.defendantSolicitorUser);
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 1));
  console.log('Defendant Solicitor responded to application: ' + childCaseNum());
  childCaseId = await I.grabGACaseNumber();
  await I.respCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyResponseSummaryPage();
  await I.navigateToTab(parentCaseNum, 'Applications');
  await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeWrittenRepresentationsDecision('orderForWrittenRepresentations', 'sequentialRep', childCaseNum(), 'yes', 'Order_Written_Representation_Sequential');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
    states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.id, config.applicantSolicitorUser);
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyJudgesSummaryPage('Sequential representations', 'yes');
  await I.verifyApplicationDocument('Written representation sequential');
  console.log('Judges made an order for Sequential written representations on case: ' + childCaseNum());
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(parentCaseNum, 'Applications');
  await I.see(states.AWAITING_WRITTEN_REPRESENTATIONS.name);
  await I.respondToJudgesWrittenRep(childCaseNum(), childCaseId, 'Written Representation Documents');
  console.log('Responded to Judges written representations on case: ' + childCaseNum());
}).retry(1);

Scenario('GA for 1v2 Same Solicitor - Send application to other party journey',
  async ({I, api}) => {
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
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
      states.AWAITING_RESPONDENT_RESPONSE.id, config.applicantSolicitorUser);
    await I.closeAndReturnToCaseDetails(caseId);
    await I.clickAndVerifyTab(parentCaseNum, 'Applications', getAppTypes().slice(0, 5), 1);
    await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);
    childCaseNumber = await I.grabChildCaseNumber();
    await I.navigateToCaseDetails(childCaseNum());
    childCaseId = await I.grabCaseNumber();
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await I.login(config.judgeUser);
    } else {
      await I.login(config.judgeLocalUser);
    }
    await I.judgeRequestMoreInfo('requestMoreInfo', 'sendApplicationToOtherParty', childCaseNum(), 'no', 'sendApplicationToOtherParty');
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
      states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.id, config.applicantSolicitorUser);
    await I.judgeCloseAndReturnToCaseDetails(childCaseId);
    await I.verifyJudgesSummaryPage('Send application to other party', 'no');
    console.log('Judges sent application to other party and requested hearing details on case: ' + childCaseNum());
    await I.login(config.applicantSolicitorUser);
    await I.navigateToTab(parentCaseNum, 'Applications');
    await I.see(states.APPLICATION_ADD_PAYMENT.name);
    await I.navigateToCaseDetails(childCaseNum());
    await I.dontSee('Go');
    await I.dontSee('Next step');
    await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
    await I.navigateToTab(parentCaseNum, 'Applications');
    await I.see(states.AWAITING_RESPONDENT_RESPONSE.name);
    await I.login(config.defendantSolicitorUser);
    await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
      'signLanguageInterpreter', getAppTypes().slice(0, 5));
    console.log('Defendant Solicitor responded to application: ' + childCaseNum());
    await I.navigateToTab(parentCaseNum, 'Applications');
    await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await I.login(config.judgeUser);
    } else {
      await I.login(config.judgeLocalUser);
    }
    await I.judgeRequestMoreInfo('requestMoreInfo', 'requestMoreInformation', childCaseNum(), 'yes', 'Request_for_information');
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
      states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.id, config.applicantSolicitorUser);
    await I.judgeCloseAndReturnToCaseDetails(childCaseId);
    console.log('Judges requested more information on case: ' + childCaseNum());
    await I.login(config.applicantSolicitorUser);
    await I.navigateToTab(parentCaseNum, 'Applications');
    await I.see(states.AWAITING_ADDITIONAL_INFORMATION.name);
  }).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
