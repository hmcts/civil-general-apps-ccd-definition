/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const listForHearingStatus = 'Listed for a Hearing';
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let civilCaseReference, gaCaseReference, caseId, childCaseNumber;

Feature('GA CP 1v1 - Hearing Notice document @ui-nightly');

Scenario('Claimant and Defendant Hearing notice journey @mm', async ({I, api}) => {
/*  civilCaseReference = await api.createUnspecifiedClaim(
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
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }*/

  await I.login(config.hearingCenterAdminRegion4);
  await I.navigateToApplicationsTab('1676461313819984');
  await I.see(listForHearingStatus);
  await I.navigateToHearingNoticePage('1676461361711992');
  await I.fillHearingNotice('1676461361711992', 'claimAndDef', 'basildon', 'VIDEO');
}).retry(0);

AfterSuite(async ({api}) => {
  //await api.cleanUp();
});
