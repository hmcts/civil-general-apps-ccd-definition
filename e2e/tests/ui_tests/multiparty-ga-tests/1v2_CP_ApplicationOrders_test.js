/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const doc = 'hearingNotice';
let civilCaseReference, gaCaseReference;

Feature('Before SDO 1v2 - GA CP - Applications Orders @ui-nightly @123');

Scenario('1v2 - Assisted order - Without notice journey', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }

  console.log('Hearing Notice creation');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.nbcAdminWithRegionId4, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeUser, civilCaseReference, gaCaseReference, doc);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeLocalUser, civilCaseReference, gaCaseReference, doc);
  }
  console.log('Hearing Notice created for: ' + gaCaseReference);
  console.log('Judge making Application order for: ' + gaCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeMakeAppOrder(gaCaseReference, 'assistedOrder', 'withoutNoticeOrder', 'Assisted_order');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
