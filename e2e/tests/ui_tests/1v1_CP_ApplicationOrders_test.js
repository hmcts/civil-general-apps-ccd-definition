/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const states = require('../../fixtures/ga-ccd/state');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');
const mpScenario = 'ONE_V_ONE';
const doc = 'hearingNotice';
let civilCaseReference, gaCaseReference, user;
const judgeApproveOrderStatus = states.ORDER_MADE.name;

Feature('Before SDO 1v1 - GA CP - Applications Orders @ui-nightly');

Scenario('1v1 - Free form order - With notice journey @e2e-tests', async ({I, api}) => {
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

  console.log('Judge making Free form application order for: ' + gaCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    user = config.judgeUser;
    await I.login(user);
  } else {
    user = config.judgeLocalUser;
    await I.login(user);
  }
  await I.judgeMakeAppOrder(gaCaseReference, 'freeFromOrder', 'withoutNoticeOrder');
  await I.judgeCloseAndReturnToCaseDetails();
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.ORDER_MADE.id, user);
  await I.verifyUploadedApplicationDocument(gaCaseReference, 'Free From Order');
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(judgeApproveOrderStatus);
  await I.verifyUploadedClaimDocument(civilCaseReference, 'Free From Order');
  await I.verifyCaseFileOrderDocument(civilCaseReference, 'General order document');
  await I.verifyCaseFileAppDocument(civilCaseReference, 'Hearing Notice');
});

Scenario('1v1 - Assisted order - Without Further Hearing @regression2', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'SoleTrader');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  const doc = 'hearingNotice';
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge List the application for hearing GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.nbcAdminWithRegionId4, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeUser, civilCaseReference, gaCaseReference, doc);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeLocalUser, civilCaseReference, gaCaseReference, doc);
  }

  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakeFinalOrder(config.judgeUser, gaCaseReference, 'ASSISTED_ORDER', false);
  }else {
    await api.judgeMakeFinalOrder(config.judgeLocalUser, gaCaseReference, 'ASSISTED_ORDER', false);
  }

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.judgeUser);
  } else {
    await I.login(config.judgeLocalUser);
  }

  await I.verifyUploadedApplicationDocument(gaCaseReference, 'Assisted Order');
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(judgeApproveOrderStatus);
  await I.verifyUploadedClaimDocument(civilCaseReference, 'Assisted Order');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
