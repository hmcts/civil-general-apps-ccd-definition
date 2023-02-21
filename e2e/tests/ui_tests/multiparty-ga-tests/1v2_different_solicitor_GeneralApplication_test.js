/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const states = require('../../../fixtures/ga-ccd/state.js');
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess, waitForFinishedBusinessProcess} = require('../../../api/testingSupport');

let {getAppTypes} = require('../../../pages/generalApplication/generalApplicationTypes');
let caseId, childCaseNumber, childCaseId, gaCaseReference, civilCaseReference;

Feature('1v2 Different Solicitor - General Application Journey @multiparty-e2e-tests @ui-nightly @mm');

BeforeSuite(async ({api}) => {
  // civilCaseReference = await api.createSpecifiedClaim(config.applicantSolicitorUser, 'ONE_V_TWO_TWO_LEGAL_REP');
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, 'ONE_V_TWO_TWO_LEGAL_REP', 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, 'ONE_V_TWO_TWO_LEGAL_REP', civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Case created for general application: ' + civilCaseReference);
});

Before(async ({I}) => {
 await I.wait(10);
});

Scenario.skip('GA for Specified Claim 1v2 different Solicitor - respond to application - Hearing order journey',
  async ({api, I}) => {
    await I.login(config.applicantSolicitorUser);
    await I.navigateToCaseDetails(civilCaseReference);
    caseId = await I.grabCaseNumber();
    await I.createGeneralApplication(
      getAppTypes().slice(0, 3),
      civilCaseReference,
      'no', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
      'signLanguageInterpreter');
    console.log('General Application created: ' + civilCaseReference);
    gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'AWAITING_RESPONDENT_RESPONSE', config.applicantSolicitorUser);
    await I.closeAndReturnToCaseDetails(caseId);
    await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(0, 3), 1);
    await I.see(states.AWAITING_RESPONDENT_RESPONSE.name);
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
    await I.navigateToTab(civilCaseReference, 'Applications');
    await I.see(states.AWAITING_RESPONDENT_RESPONSE.name);
    await I.login(config.secondDefendantSolicitorUser);
    await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
      'signLanguageInterpreter', getAppTypes().slice(0, 3));
    console.log('Org2 solicitor Responded to application: ' + childCaseNum());
    await I.respCloseAndReturnToCaseDetails(childCaseId);
    await I.navigateToTab(civilCaseReference, 'Applications');
    await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);
    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await I.login(config.judgeUser);
    } else {
      await I.login(config.judgeLocalUser);
    }
    await I.judgeListForAHearingDecision('listForAHearing', childCaseNum(), 'yes', 'Hearing_order');
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.applicantSolicitorUser);
    await I.judgeCloseAndReturnToCaseDetails(childCaseId);
    await I.verifyJudgesSummaryPage('Hearing order', 'yes');
    await I.verifyApplicationDocument('Hearing order');
    await I.dontSee('Go');
    await I.dontSee('Next step');
    console.log('Judges list for a hearing on case: ' + childCaseNum());
    await I.login(config.applicantSolicitorUser);
    await I.navigateToTab(civilCaseReference, 'Applications');
    await I.see(states.LISTING_FOR_A_HEARING.name);
  }).retry(1);

Scenario('Without Notice application for a hearing', async ({api, I}) => {
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, states.LISTING_FOR_A_HEARING.id);
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, states.LISTING_FOR_A_HEARING.id);
  await I.login(config.secondDefendantSolicitorUser);
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.LISTING_FOR_A_HEARING.name);
}).retry(1);

Scenario('Without Notice application to With Notice application - Directions Order @e2e-tests',
  async ({api, I}) => {
    gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.secondDefendantSolicitorUser, civilCaseReference);
    await I.login(config.secondDefendantSolicitorUser);
    await I.navigateToApplicationsTab(civilCaseReference);
    await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);

    await waitForFinishedBusinessProcess(civilCaseReference, config.secondDefendantSolicitorUser);
    await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, null);
    await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, null);

    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference);
    } else {
      await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference);
    }
    await api.additionalPaymentSuccess(config.secondDefendantSolicitorUser, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);

    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
    await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
    await api.verifyGAState(config.secondDefendantSolicitorUser, civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);

    await api.respondentResponse1v2(config.defendantSolicitorUser, config.applicantSolicitorUser, gaCaseReference);

    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await api.judgeMakesDecisionDirectionsOrder(config.judgeUser, gaCaseReference);
    } else {
      await api.judgeMakesDecisionDirectionsOrder(config.judgeLocalUser, gaCaseReference);
    }

    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, states.AWAITING_DIRECTIONS_ORDER_DOCS.id);
    await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, states.AWAITING_DIRECTIONS_ORDER_DOCS.id);
    await I.login(config.secondDefendantSolicitorUser);
    await I.navigateToApplicationsTab(civilCaseReference);
    await I.see(states.AWAITING_DIRECTIONS_ORDER_DOCS.name);
  }).retry(1);

Scenario('Without Notice application - Org2 Solicitor Initiate GA - Awaiting Written Representations',
  async ({api, I}) => {
    await I.login(config.defendantSolicitorUser);
    gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.defendantSolicitorUser, civilCaseReference);
    await I.navigateToApplicationsTab(civilCaseReference);
    await I.see(states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name);

    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await api.judgeMakesDecisionWrittenRep(config.judgeUser, gaCaseReference);
    } else {
      await api.judgeMakesDecisionWrittenRep(config.judgeLocalUser, gaCaseReference);
    }

    await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference,
      states.AWAITING_WRITTEN_REPRESENTATIONS.id);
    await I.login(config.secondDefendantSolicitorUser);
    await I.navigateToCaseDetails(civilCaseReference);
    await I.dontSee('Applications', 'div.mat-tab-label-content');
    await I.login(config.applicantSolicitorUser);
    await I.navigateToCaseDetails(civilCaseReference);
    await I.dontSee('Applications', 'div.mat-tab-label-content');
  }).retry(1);

Scenario('With Notice application - Org3 Solicitor Initiate GA @e2e-tests', async ({api, I}) => {
  await api.initiateGeneralApplicationWithNoStrikeOut(config.secondDefendantSolicitorUser, civilCaseReference);
  await I.login(config.secondDefendantSolicitorUser);
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.AWAITING_RESPONDENT_RESPONSE.name);
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
}).retry(1);

Scenario('With Notice application - Org2 Solicitor Initiate GA', async ({api, I}) => {
  await api.initiateGeneralApplicationWithNoStrikeOut(config.defendantSolicitorUser, civilCaseReference);
  await I.login(config.defendantSolicitorUser);
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.AWAITING_RESPONDENT_RESPONSE.name);
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
  await api.verifyGAState(config.secondDefendantSolicitorUser, civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
}).retry(1);

AfterSuite(async ({api}) => {
  // await api.cleanUp();
});
