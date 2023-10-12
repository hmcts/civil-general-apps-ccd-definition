/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const states = require('../../fixtures/ga-ccd/state.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const hnStateStatus = states.HEARING_SCHEDULED.id;

let civilCaseReference, gaCaseReference;

Feature('GA 1v2 Judge makes order application after hearing API tests @api-nightly');

Scenario('Without Notice Hearing notice journey @123', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge makes order application after hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  const doc = 'hearingNotice';
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes order application after hearing GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.nbcAdminWithRegionId4, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeUser, civilCaseReference, gaCaseReference, doc);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeLocalUser, civilCaseReference, gaCaseReference, doc);
  }

  console.log('*** End Response to GA Case Reference 1 : ' + gaCaseReference + ' ***');

  console.log('Make a General Application TWO');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference 2 : ' + gaCaseReference + ' ***');

  /*await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, hnStateStatus);
  await api.assertNullGaDocumentVisibilityToUser(config.applicantSolicitorUser, civilCaseReference, doc);
  await api.assertGaDocumentVisibilityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, doc);

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakeFinalOrder(config.judgeUser, gaCaseReference, 'FREE_FORM_ORDER', false);
  } else {
    await api.judgeMakeFinalOrder(config.judgeLocalUser, gaCaseReference, 'FREE_FORM_ORDER', false);
  }
  const finalDoc = 'generalOrder';
  await api.assertNullGaDocumentVisibilityToUser(config.applicantSolicitorUser, civilCaseReference, finalDoc);
  await api.assertGaDocumentVisibilityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, finalDoc);*/
});

AfterSuite(async ({api}) => {
  // await api.cleanUp();
});
