/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const states = require('../../fixtures/ga-ccd/state.js');

const mpScenario = 'ONE_V_ONE';
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');

let civilCaseReference, gaCaseReference;

Feature('Before SDO 1v1 - GA CP - Hearing Notice document @ui-nightly');

Scenario('Claimant and Defendant Hearing notice journey', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
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

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.nbcAdminWithRegionId4);
  } else {
    await I.login(config.hearingCenterAdminLocal);
  }

  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.LISTING_FOR_A_HEARING.name);
  await I.navigateToHearingNoticePage(gaCaseReference);
  await I.fillHearingNotice(gaCaseReference, 'claimAndDef', 'basildon', 'VIDEO');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'HEARING_SCHEDULED_GA', config.hearingCenterAdminRegion4);
  console.log('Hearing Notice created for: ' + gaCaseReference);
  await I.click('Close and Return to case details');
  await I.verifyApplicationDocument('Hearing Notice');
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.HEARING_SCHEDULED.name);
  await I.verifyClaimDocument('Hearing Notice');

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'HEARING_SCHEDULED_GA');
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'HEARING_SCHEDULED_GA');
}).retry(0);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
