/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const states = require('../../../fixtures/ga-ccd/state');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const doc = 'hearingNotice';
const listForHearingStatus = states.LISTING_FOR_A_HEARING.name;
let civilCaseReference, gaCaseReference, user;

Feature('Before SDO 1v2 - GA CP - Applications Orders @ui-nightly @regression1');

Scenario('1v2 - Assisted order - With Further Hearing @e2e-tests', async ({I, api}) => {
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
    await api.judgeListApplicationForHearing(config.judgeUserWithRegionId1, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }

  console.log('Hearing Notice creation');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.nbcAdminWithRegionId4, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeUserWithRegionId1, civilCaseReference, gaCaseReference, doc);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeLocalUser, civilCaseReference, gaCaseReference, doc);
  }
  console.log('Hearing Notice created for: ' + gaCaseReference);

  console.log('Judge making Assisted order for: ' + gaCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    user = config.judgeUserWithRegionId1;
    await I.login(user);
  } else {
    user = config.judgeLocalUser;
    await I.login(user);
  }
  await I.judgeMakeAppOrder(gaCaseReference, 'assistedOrder', 'withoutNoticeOrder');
  await I.judgeCloseAndReturnToCaseDetails();
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.LISTING_FOR_A_HEARING.id, user);

  await I.verifyUploadedApplicationDocument(gaCaseReference, 'Assisted Order');

  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(listForHearingStatus);

  await I.verifyUploadedClaimDocument(civilCaseReference, 'Assisted Order');

  await I.verifyCaseFileOrderDocument(civilCaseReference, 'General order document');
  await I.verifyCaseFileAppDocument(civilCaseReference, 'Hearing Notice');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
