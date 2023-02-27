/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const events = require("../../fixtures/ga-ccd/events");
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const hnStateStatus = events.HEARING_SCHEDULED_GA.state;

let civilCaseReference, gaCaseReference;

Feature('GA 1v2 Judge list the application for hearing  API tests @api-nightly');

Scenario('Judge makes decision 1V1 - LIST FOR HEARING', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'SoleTrader');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge List the application for hearing GA Case Reference: ' + gaCaseReference + ' ***');
});

Scenario('Without Notice Hearing notice journey', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
      config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.defendantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  const doc = 'hearingNotice';
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge List the application for hearing GA Case Reference: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.nbcAdminWithRegionId4, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser( config.judgeUser, civilCaseReference, gaCaseReference, doc)
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser( config.judgeLocalUser, civilCaseReference, gaCaseReference, doc)
  }

  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, hnStateStatus);
  await api.assertNullGaDocumentVisibilityToUser( config.applicantSolicitorUser, civilCaseReference, doc);
  await api.assertGaDocumentVisibilityToUser( config.defendantSolicitorUser, civilCaseReference, gaCaseReference, doc);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
