/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');
const states = require('../../fixtures/ga-ccd/state');

const listForHearingStatus = states.LISTING_FOR_A_HEARING.name;
const hnStatus = states.HEARING_SCHEDULED.name;
const mpScenario = 'ONE_V_ONE';
let civilCaseReference, gaCaseReference;

Feature('Before SDO 1v1 - GA CP - Hearing Notice document @ui-nightly @regression2');

Scenario('Claimant and Defendant Hearing notice - With notice journey', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
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
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }

  console.log('Hearing Notice creation');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.nbcAdminWithRegionId4);
  } else {
    await I.login(config.hearingCenterAdminLocal);
  }

  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(listForHearingStatus);
  await I.navigateToHearingNoticePage(gaCaseReference);
  await I.fillHearingNotice(gaCaseReference, 'claimAndDef', 'basildon', 'VIDEO');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.HEARING_SCHEDULED.id, config.nbcAdminWithRegionId4);
  console.log('Hearing Notice created for: ' + gaCaseReference);
  await I.click('Close and Return to case details');
  await I.verifyApplicationDocument('Hearing Notice');
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(hnStatus);
  await I.verifyClaimDocument('Hearing Notice');

  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.verifyClaimDocument('Hearing Notice');
  await I.navigateToCaseDetails(gaCaseReference);
  await I.verifyApplicationDocument('Hearing Notice');

  await I.login(config.defendantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.verifyClaimDocument('Hearing Notice');
  await I.navigateToCaseDetails(gaCaseReference);
  await I.verifyApplicationDocument('Hearing Notice');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.assertGaAppCollectionVisiblityToUser(config.nbcAdminWithRegionId4, civilCaseReference, gaCaseReference, 'Y');
    await api.assertGaAppCollectionVisiblityToUser(config.judgeUser, civilCaseReference, gaCaseReference, 'Y');
  } else {
    await api.assertGaAppCollectionVisiblityToUser(config.nbcAdminWithRegionId4, civilCaseReference, gaCaseReference, 'Y');
    await api.assertGaAppCollectionVisiblityToUser(config.judgeLocalUser, civilCaseReference, gaCaseReference, 'Y');
  }

  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
