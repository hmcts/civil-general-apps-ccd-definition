/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference,
  gaCaseReference;

Feature('GA 1v2 Defendant Response Case Close API tests');

Scenario.skip('Case offline AWAITING_WRITTEN_REPRESENTATIONS', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);

  console.log('Make a General Application with state AWAITING_WRITTEN_REPRESENTATIONS');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionWrittenRep(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeMakesDecisionWrittenRep(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');


  console.log('*** Case offline: ' + civilCaseReference + ' ***');
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.defendantResponseClaim(config.secondDefendantSolicitorUser, mpScenario, 'solicitorTwo');

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario.skip('Case offline APPLICATION_ADD_PAYMENT', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);

  console.log('Make a General Application with state APPLICATION_ADD_PAYMENT');
  gaCaseReference
    = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** Start Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
    + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference, true, true);
  } else {
    await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference, true, true);
  }
  console.log('*** End Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('*** Case offline: ' + civilCaseReference + ' ***');
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.defendantResponseClaim(config.secondDefendantSolicitorUser, mpScenario, 'solicitorTwo');

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario.skip('Case offline ORDER_MADE', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);

  console.log('Make a General Application with state ORDER_MADE');
  gaCaseReference
    = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** Start Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
    + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesOrderDecisionUncloak(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeMakesOrderDecisionUncloak(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('*** Case offline: ' + civilCaseReference + ' ***');
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.defendantResponseClaim(config.secondDefendantSolicitorUser, mpScenario, 'solicitorTwo');

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'ORDER_MADE');
});

Scenario.skip('Case offline AWAITING_RESPONDENT_RESPONSE', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Case offline: ' + civilCaseReference + ' ***');
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.defendantResponseClaim(config.secondDefendantSolicitorUser, mpScenario, 'solicitorTwo');

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
