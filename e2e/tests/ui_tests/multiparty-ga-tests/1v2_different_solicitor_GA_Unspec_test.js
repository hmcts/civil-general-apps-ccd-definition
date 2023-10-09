/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const states = require('../../../fixtures/ga-ccd/state.js');

const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const respondentStatus = states.AWAITING_RESPONDENT_RESPONSE.name;
const judgeDecisionStatus = states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name;
const listForHearingStatus = states.LISTING_FOR_A_HEARING.name;
const judgeDirectionsOrderStatus = states.AWAITING_DIRECTIONS_ORDER_DOCS.name;
let gaCaseReference, civilCaseReference;

Feature('1v2 Different Solicitor - General Application Journey @multiparty-e2e-tests @ui-nightly');

BeforeSuite(async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'SoleTrader');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
});

Scenario('Without Notice application for a hearing @regression1', async ({api, I}) => {
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

Scenario('Without Notice application to With Notice application - Directions Order @regression1',
  async ({api, I}) => {
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
      await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference, true, true);
    } else {
      await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference, true, true);
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

Scenario('With Notice application - Org2 Solicitor Initiate GA @regression1', async ({api, I}) => {
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
  await api.assertGAApplicantDisplayName(config.defendantSolicitorUser, gaCaseReference);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
