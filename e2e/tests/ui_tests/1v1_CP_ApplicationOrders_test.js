/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const doc = 'hearingNotice';
let civilCaseReference, gaCaseReference;

Feature('Before SDO 1v1 - GA CP - Applications Orders @ui-nightly');

Scenario('1v1 - Free form applications orders - With notice journey', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'SoleTrader');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }

  console.log('Hearing Notice creation');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.nbcAdminWithRegionId4, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser( config.judgeUser, civilCaseReference, gaCaseReference, doc);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser( config.judgeLocalUser, civilCaseReference, gaCaseReference, doc);
  }
  console.log('Hearing Notice created for: ' + gaCaseReference);

  console.log('Judge making Application order for: ' + gaCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }
  await I.judgeMakeAppOrder(gaCaseReference, 'freeFromOrder', 'withoutNoticeOrder', 'Free_form_order');
  await I.judgeCloseAndReturnToCaseDetails();
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
