/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const {getAppTypes} = require('../../../pages/generalApplication/generalApplicationTypes');
const states = require('../../../fixtures/ga-ccd/state.js');

const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const respondentStatus = states.AWAITING_RESPONDENT_RESPONSE.name;
const judgeDecisionStatus = states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name;
const listForHearingStatus = states.LISTING_FOR_A_HEARING.name;
const judgeDirectionsOrderStatus = states.AWAITING_DIRECTIONS_ORDER_DOCS.name;
const writtenRepStatus = states.AWAITING_WRITTEN_REPRESENTATIONS.name;
const awaitingPaymentStatus = states.AWAITING_APPLICATION_PAYMENT.name;
let gaCaseReference, civilCaseReference;

Feature('1v2 Different Solicitor - General Application Journey @multiparty-e2e-tests @ui-nightly');

Scenario('GA for Specified Claim 1v2 different Solicitor - respond to application - Hearing order journey',
  async ({api, I}) => {
    civilCaseReference = await api.createSpecifiedClaim(config.applicantSolicitorUser, mpScenario);
    console.log('Case created for general application: ' + civilCaseReference);
    await I.login(config.applicantSolicitorUser);
    await I.navigateToCaseDetails(civilCaseReference);
    await I.createGeneralApplication(
      getAppTypes().slice(0, 3),
      civilCaseReference,
      'no', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
      'signLanguageInterpreter');
    console.log('General Application created: ' + civilCaseReference);
    gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
      states.AWAITING_APPLICATION_PAYMENT.id, config.applicantSolicitorUser);
    await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(0, 3), 1);
    await I.see(awaitingPaymentStatus);
    await I.payAndVerifyGAStatus(civilCaseReference, gaCaseReference,
      states.AWAITING_RESPONDENT_RESPONSE.id, config.applicantSolicitorUser, respondentStatus);
    await I.navigateToCaseDetails(gaCaseReference);
    await I.verifyApplicantSummaryPage();

    console.log('Defendant 1 solicitor responding:' + gaCaseReference);
    await I.login(config.defendantSolicitorUser);
    await I.respondToApplication(gaCaseReference, 'yes', 'yes', 'yes', 'yes', 'no',
      'signLanguageInterpreter', getAppTypes().slice(0, 3));
    console.log('Defendant 1 solicitor responded to application: ' + gaCaseReference);
    await I.respCloseAndReturnToCaseDetails();
    await I.verifyResponseSummaryPage();
    await I.respondToSameApplicationAndVerifyErrorMsg();
    await I.navigateToTab(civilCaseReference, 'Applications');
    await I.see(respondentStatus);

    console.log('Defendant 2 solicitor responding:' + gaCaseReference);
    await I.login(config.secondDefendantSolicitorUser);
    await I.respondToApplication(gaCaseReference, 'yes', 'yes', 'yes', 'yes', 'no',
      'signLanguageInterpreter', getAppTypes().slice(0, 3));
    console.log('Defendant 2 solicitor Responded to application: ' + gaCaseReference);
    await I.respCloseAndReturnToCaseDetails();
    await I.navigateToTab(civilCaseReference, 'Applications');
    await I.see(judgeDecisionStatus);

    console.log('Judge Making decision:' + gaCaseReference);
    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await I.login(config.judgeUser);
    } else {
      await I.login(config.judgeLocalUser);
    }
    await I.judgeListForAHearingDecision('listForAHearing', gaCaseReference, 'yes', 'Hearing_order');
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
      states.LISTING_FOR_A_HEARING.id, config.applicantSolicitorUser);
    await I.judgeCloseAndReturnToCaseDetails();
    await I.verifyJudgesSummaryPage('Hearing order', 'yes');
    await I.verifyApplicationDocument('Hearing order');
    await I.dontSee('Go');
    await I.dontSee('Next step');
    console.log('Judges list for a hearing on case: ' + gaCaseReference);
    await I.login(config.applicantSolicitorUser);
    await I.navigateToTab(civilCaseReference, 'Applications');
    await I.see(listForHearingStatus);
  });

Scenario('Without Notice application for a hearing', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'SoleTrader');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }
  await I.login(config.applicantSolicitorUser);
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(listForHearingStatus);

  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser,
    civilCaseReference, gaCaseReference, null);
  await api.assertGaAppCollectionVisiblityToUser(config.secondDefendantSolicitorUser,
    civilCaseReference, gaCaseReference, null);
});

Scenario('Without Notice application to With Notice application - Directions Order @e2e-tests',
  async ({api, I}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
      config.applicantSolicitorUser, mpScenario, 'SoleTrader');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
    console.log('Civil Case created for general application: ' + civilCaseReference);
    gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.secondDefendantSolicitorUser,
      civilCaseReference);
    await I.login(config.secondDefendantSolicitorUser);
    await I.navigateToApplicationsTab(civilCaseReference);
    await I.see(judgeDecisionStatus);
    await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser,
      civilCaseReference, gaCaseReference, null);
    await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser,
      civilCaseReference, gaCaseReference, null);

    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference);
    } else {
      await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference);
    }
    await api.additionalPaymentSuccess(config.secondDefendantSolicitorUser, gaCaseReference,
      states.AWAITING_RESPONDENT_RESPONSE.id);

    await api.verifyGAState(config.applicantSolicitorUser,
      civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
    await api.verifyGAState(config.defendantSolicitorUser,
      civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
    await api.verifyGAState(config.secondDefendantSolicitorUser,
      civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);

    await api.respondentResponse1v2(config.defendantSolicitorUser, config.applicantSolicitorUser, gaCaseReference);

    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await api.judgeMakesDecisionDirectionsOrder(config.judgeUser, gaCaseReference);
    } else {
      await api.judgeMakesDecisionDirectionsOrder(config.judgeLocalUser, gaCaseReference);
    }

    await I.login(config.defendantSolicitorUser);
    await I.navigateToApplicationsTab(civilCaseReference);
    await I.see(judgeDirectionsOrderStatus);
    await api.verifyGAState(config.applicantSolicitorUser,
      civilCaseReference, gaCaseReference, states.AWAITING_DIRECTIONS_ORDER_DOCS.id);
    await api.verifyGAState(config.secondDefendantSolicitorUser,
      civilCaseReference, gaCaseReference, states.AWAITING_DIRECTIONS_ORDER_DOCS.id);
  });

Scenario('Without Notice application - Org2 Solicitor Initiate GA - Awaiting Written Representations',
  async ({api, I}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
      config.applicantSolicitorUser, mpScenario, 'SoleTrader');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
    console.log('Civil Case created for general application: ' + civilCaseReference);
    gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.defendantSolicitorUser, civilCaseReference);
    await I.login(config.defendantSolicitorUser);
    await I.navigateToApplicationsTab(civilCaseReference);
    await I.see(judgeDecisionStatus);

    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await api.judgeMakesDecisionWrittenRep(config.judgeUser, gaCaseReference);
    } else {
      await api.judgeMakesDecisionWrittenRep(config.judgeLocalUser, gaCaseReference);
    }
    await I.login(config.defendantSolicitorUser);
    await I.navigateToApplicationsTab(civilCaseReference);
    await I.see(writtenRepStatus);

    await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser,
      civilCaseReference, gaCaseReference, null);
    await api.assertGaAppCollectionVisiblityToUser(config.secondDefendantSolicitorUser,
      civilCaseReference, gaCaseReference, null);
  });

Scenario('With Notice application - Org3 Solicitor Initiate GA @e2e-tests', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  gaCaseReference = await api.initiateGeneralApplicationWithNoStrikeOut(config.secondDefendantSolicitorUser,
    civilCaseReference);
  await I.login(config.secondDefendantSolicitorUser);
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(respondentStatus);

  await api.verifyGAState(config.applicantSolicitorUser,
    civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
  await api.verifyGAState(config.defendantSolicitorUser,
    civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
});

Scenario('With Notice application - Org2 Solicitor Initiate GA', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  gaCaseReference = await api.initiateGeneralApplicationWithNoStrikeOut(config.defendantSolicitorUser, civilCaseReference);
  await I.login(config.defendantSolicitorUser);
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(respondentStatus);

  await api.verifyGAState(config.applicantSolicitorUser,
    civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
  await api.verifyGAState(config.secondDefendantSolicitorUser,
    civilCaseReference, gaCaseReference, states.AWAITING_RESPONDENT_RESPONSE.id);
  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser,
    civilCaseReference, gaCaseReference, 'Y');
  await api.assertGaAppCollectionVisiblityToUser(config.secondDefendantSolicitorUser,
    civilCaseReference, gaCaseReference, 'Y');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
